import reduceLinked from '@/src/reduceLinked';

interface Person {
  name: string;
  mother?: Person;
  father?: Person;
}

describe('reduceLinked', () => {
  const grandFather: Person = {
    name: '할아버지',
  };
  const father: Person = {
    name: '아빠',
    father: grandFather,
  };
  const mother: Person = {
    name: '엄마',
  };
  const me: Person = {
    name: '나',
    father,
    mother,
  };

  test('should reduce linked object with property and reducer', () => {
    const result = reduceLinked(me, 'father', (acc, person) => ({ ...acc, name: acc.name + person.name }));
    expect(result.name).toBe('아빠할아버지');
  });

  test('should reduce linked object itself with self option', () => {
    const result = reduceLinked(me, 'father', (acc, person) => ({ ...acc, name: acc.name + person.name }), { self: true });
    expect(result.name).toBe('나아빠할아버지');
  });

  test('should reduce deep linked object', () => {
    const result = reduceLinked(me, 'father', (acc, person) => ({ ...acc, name: acc.name + person.name + '조상님' }));
    expect(result.name).toBe('아빠할아버지조상님');
  });

  test('should reduce linked object with property getter and reducer', () => {
    const getParent = (person?: Person) => (person?.mother ? 'mother' : 'father');
    const result = reduceLinked(me, getParent, (acc, person) => ({ ...acc, name: acc.name + person.name }));
    expect(result.name).toBe('엄마');
  });
});
