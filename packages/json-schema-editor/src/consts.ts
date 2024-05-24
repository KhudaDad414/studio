export const COMMON_JSON_SCHEMA_AND_OAS_FORMATS = {
  // strings are omitted because they are the default type to apply format to
  number: ['byte', 'int32', 'int64', 'float', 'double'],
  get integer() {
    return this.number;
  },
};
