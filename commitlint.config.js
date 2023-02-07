const CommitTypeEnum = {
  feat: 'feat',
  fix: 'fix',
  refactor: 'refactor',
  chore: 'chore',
  docs: 'docs',
  test: 'test',
  format: 'format',
  rename: 'rename',
  revert: 'revert',
  wip: 'wip',
};

module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', Object.values(CommitTypeEnum)],
  },
  prompt: {
    questions: {
      type: {
        enum: {
          [CommitTypeEnum.feat]: {
            description: 'A new feature',
            title: 'Features',
            emoji: '🚀',
          },
          [CommitTypeEnum.fix]: {
            description: 'A bug fix',
            title: 'Bug Fixes',
            emoji: '🐛',
          },
          [CommitTypeEnum.refactor]: {
            description: 'A code change that improves performance nor improves productivity',
            title: 'Code Refactoring',
            emoji: '🏢',
          },
          [CommitTypeEnum.chore]: {
            description: "Other changes that don't modify src or test files (e.g.: Build system, External dependencies, CI)",
            title: 'Chores',
            emoji: '📦',
          },
          [CommitTypeEnum.docs]: {
            description: 'Documentation only changes',
            title: 'Documentation',
            emoji: '📚',
          },
          [CommitTypeEnum.test]: {
            description: 'Adding missing tests or correcting existing tests',
            title: 'Tests',
            emoji: '🚨',
          },
          [CommitTypeEnum.format]: {
            description: 'Changes that do not affect the meaning of the code (e.g.: white-space, formatting, missing semi-colons, etc)',
            title: 'Formatting',
            emoji: '💎',
          },
          [CommitTypeEnum.rename]: {
            description: 'Move and rename files',
            title: 'Rename',
            emoji: '📝',
          },
          [CommitTypeEnum.revert]: {
            description: 'Reverts a previous commit',
            title: 'Reverts',
            emoji: '🗑',
          },
          [CommitTypeEnum.wip]: {
            description: 'Work-In-Progress',
            title: 'WIP',
            emoji: '👷',
          },
        },
      },
    },
  },
};
