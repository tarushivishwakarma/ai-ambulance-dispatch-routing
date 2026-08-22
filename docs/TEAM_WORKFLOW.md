# Team Workflow Guidelines

To avoid merge conflicts and maintain code quality while working directly on the `main` branch, please follow these rules:

## 1. Always Pull Before Working
Before starting your coding session, pull the latest changes:
```bash
git pull origin main
```

## 2. Commit Frequently and Clearly
When you finish a task or sub-task, commit your code with a meaningful description:
```bash
git add .
git commit -m "Meaningful description of what changed"
```

## 3. Rebase Before Pushing
To keep the history clean and integrate your changes with any recent pushes by teammates:
```bash
git pull --rebase origin main
```
Resolve any conflicts if they occur.

## 4. Push Changes
```bash
git push origin main
```

**CRITICAL RULE**: Never use `git push --force`.

## 5. Module Ownership
Communicate with the team to ensure you are working on separate modules (e.g., one person on frontend dashboard, another on backend models) to minimize file conflicts.
