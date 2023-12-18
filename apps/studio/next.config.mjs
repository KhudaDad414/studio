import withYaml  from 'next-plugin-yaml';
export default withYaml(
  {
    webpack: config => {
      config.resolve.fallback = {
        fs: false
      }
      return config;
    },
  }
);