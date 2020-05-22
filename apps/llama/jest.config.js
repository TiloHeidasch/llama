module.exports = {
  name: 'llama',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/llama',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
