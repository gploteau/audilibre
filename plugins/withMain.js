const { withMainActivity } = require('@expo/config-plugins');
const { mergeContents } = require('@expo/config-plugins/build/utils/generateCode');

function addMainActivityImport(src, packageId) {
  const newSrc = ['import org.devio.rn.splashscreen.SplashScreen'];

  return mergeContents({
    tag: 'rn-splashscreen-import',
    src,
    newSrc: newSrc.join('\n'),
    anchor: `package ${packageId}`,
    offset: 1,
    comment: '//',
  });
}

function addMainActivityOnCreate(src) {
  const newSrc = [
    `    SplashScreen.show(this, R.id.lottie); 
    SplashScreen.setAnimationFinished(true);`,
  ];

  return mergeContents({
    tag: 'rn-splashscreen-oncreate',
    src,
    newSrc: newSrc.join('\n'),
    anchor: /setTheme\(R\.style\.AppTheme\);/,
    offset: 1,
    comment: '//',
  });
}

function withMain(config) {
  return withMainActivity(config, (config) => {
    config.modResults.contents = addMainActivityImport(
      config.modResults.contents,
      config.android?.package
    ).contents;

    config.modResults.contents = addMainActivityOnCreate(config.modResults.contents).contents;

    return config;
  });
}

module.exports = withMain;
