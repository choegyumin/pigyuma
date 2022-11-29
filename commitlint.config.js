module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "docs",
        "style",
        "refactor",
        "test",
        "chore",
        "revert",
        "wip",
      ],
    ],
  },
  prompt: {
    questions: {
      type: {
        enum: {
          feat: {
            description: "A new feature",
            title: "Features",
            emoji: "🚀",
          },
          fix: {
            description: "A bug fix",
            title: "Bug Fixes",
            emoji: "🐛",
          },
          docs: {
            description: "Documentation only changes",
            title: "Documentation",
            emoji: "📚",
          },
          style: {
            description:
              "Changes that do not affect the meaning of the code (e.g.: white-space, formatting, missing semi-colons, etc)",
            title: "Styles",
            emoji: "💎",
          },
          refactor: {
            description:
              "A code change that improves performance nor improves productivity",
            title: "Code Refactoring",
            emoji: "🏢",
          },
          test: {
            description: "Adding missing tests or correcting existing tests",
            title: "Tests",
            emoji: "🚨",
          },
          chore: {
            description:
              "Other changes that don't modify src or test files (e.g.: Build system, External dependencies, CI)",
            title: "Chores",
            emoji: "📦",
          },
          revert: {
            description: "Reverts a previous commit",
            title: "Reverts",
            emoji: "🗑",
          },
          wip: {
            description: "Work-In-Progress",
            title: "WIP",
            emoji: "🛠",
          },
        },
      },
    },
  },
};
