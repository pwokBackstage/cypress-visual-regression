const path = require('path');

const BlinkDiff = require('blink-diff');

// TODO: allow user to define/update
const SNAPSHOT_DIRECTORY = process.env.SNAPSHOT_DIRECTORY || path.join(
  __dirname, '..', '..', '..', 'cypress', 'snapshots',
);

const SCREENSHOT_DIRECTORY = process.env.SCREENSHOT_DIRECTORY || path.join(
  __dirname, '..', '..', '..', 'cypress', 'screenshots',
);

function compareSnapshotsPlugin(args) {
  return new Promise((resolve, reject) => {
    const diff = new BlinkDiff({
      imageAPath: path.join(SNAPSHOT_DIRECTORY, 'base', args.specDirectory, `${args.fileName}.png`), // Use file-path
      imageBPath: path.join(SCREENSHOT_DIRECTORY, args.specDirectory, `${args.fileName}.png`),
      thresholdType: BlinkDiff.THRESHOLD_PERCENT,
      threshold: 0.1, // 1% threshold
      imageOutputPath: path.join(SNAPSHOT_DIRECTORY, 'diff', args.specDirectory, `${args.fileName}.png`),
    });

    diff.run((error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
}

function getCompareSnapshotsPlugin(on) {
  on('task', { compareSnapshotsPlugin });
}

module.exports = getCompareSnapshotsPlugin;
