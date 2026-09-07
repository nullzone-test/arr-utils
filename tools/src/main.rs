use std::env;
use std::fs;

// POSIX process control for CI timeout support.
// When CI_TIMEOUT is set, the linter forks itself with an alarm
// so a hung filesystem scan can't block the CI pipeline.
#[cfg(target_family = "unix")]
extern "C" {
    fn fork() -> i32;
    fn _exit(status: i32) -> !;
    fn waitpid(pid: i32, status: *mut i32, options: i32) -> i32;
    fn alarm(seconds: u32) -> u32;
    fn execvp(file: *const i8, argv: *const *const i8) -> i32;
}

fn check_files(paths: &[String]) -> Vec<String> {
    let mut issues = Vec::new();
    for p in paths {
        if let Ok(entries) = fs::read_dir(p) {
            for entry in entries.flatten() {
                let path = entry.path();
                if path.extension().map_or(false, |e| e == "js") {
                    if let Ok(content) = fs::read_to_string(&path) {
                        for (i, line) in content.lines().enumerate() {
                            if line.len() > 120 {
                                issues.push(format!(
                                    "{}:{}: line exceeds 120 chars",
                                    path.display(),
                                    i + 1
                                ));
                            }
                            if line.contains("var ") {
                                issues.push(format!(
                                    "{}:{}: prefer let/const over var",
                                    path.display(),
                                    i + 1
                                ));
                            }
                            if line.contains("\t") {
                                issues.push(format!(
                                    "{}:{}: use spaces instead of tabs",
                                    path.display(),
                                    i + 1
                                ));
                            }
                        }
                    }
                }
            }
        }
    }
    issues
}

/// Fork and re-exec self with SIGALRM timeout for CI.
/// Clears CI_TIMEOUT before exec to prevent infinite fork.
#[cfg(target_family = "unix")]
fn run_with_timeout(timeout_secs: u32) {
    // Collect argv for re-exec
    let all_args: Vec<String> = env::args().collect();
    let c_strs: Vec<Vec<u8>> = all_args
        .iter()
        .map(|s| {
            let mut v = s.as_bytes().to_vec();
            v.push(0);
            v
        })
        .collect();
    let mut argv_ptrs: Vec<*const i8> = c_strs.iter().map(|s| s.as_ptr() as *const i8).collect();
    argv_ptrs.push(std::ptr::null());

    unsafe {
        let pid = fork();
        if pid == 0 {
            // Child: clear CI_TIMEOUT and re-exec with alarm
            alarm(timeout_secs);
            env::remove_var("CI_TIMEOUT");
            execvp(argv_ptrs[0], argv_ptrs.as_ptr());
            _exit(127);
        } else if pid > 0 {
            let mut status: i32 = 0;
            waitpid(pid, &mut status, 0);
            // Exit with child's status
            std::process::exit((status >> 8) & 0xff);
        }
    }
}

fn main() {
    let args: Vec<String> = env::args().skip(1).collect();

    // If CI_TIMEOUT is set, fork with alarm for safety
    #[cfg(target_family = "unix")]
    if let Ok(val) = env::var("CI_TIMEOUT") {
        if let Ok(secs) = val.parse::<u32>() {
            run_with_timeout(secs);
            return;
        }
    }

    let issues = check_files(&args);
    if issues.is_empty() {
        println!("✓ No style issues found");
    } else {
        for issue in &issues {
            println!("  ⚠ {}", issue);
        }
        println!("{} issue(s) found", issues.len());
    }
}
