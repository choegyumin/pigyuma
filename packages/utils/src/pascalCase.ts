import camelCase from 'lodash-es/camelCase';
import upperFirst from 'lodash-es/upperFirst';

type PascalCase = typeof camelCase;

const pascalCase: PascalCase = function pascalCase(string?: string): string {
  return upperFirst(camelCase(string));
};

export default pascalCase;
