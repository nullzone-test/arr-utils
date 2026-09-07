use std::env;
use std::fs;
use std::process::Command;

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

fn main() {
    let args: Vec<String> = env::args().skip(1).collect();

    if args.iter().any(|a| a == "--version") {
        let ver = Command::new("rustc")
            .arg("--version")
            .output()
            .map(|o| String::from_utf8_lossy(&o.stdout).trim().to_string())
            .unwrap_or_else(|_| "unknown".to_string());
        println!("lint-check 1.0.0 ({})", ver);
        return;
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
