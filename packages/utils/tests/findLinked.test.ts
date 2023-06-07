import findLinked from '@/src/findLinked';

interface Person {
  name: string;
  mother?: Person;
  father?: Person;
}

describe('findLinked', () => {
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

  test('should find linked object with property and predicate', () => {
    const result = findLinked(me, 'father', (person) => person.name === '아빠');
    expect(result).toBe(father);
  });

  test('should return undefined if no linked object matches predicate', () => {
    const result = findLinked(me, 'father', (person) => person.name === '엄마');
    expect(result).toBeUndefined();
  });

  test('should return undefined if no linked object is found', () => {
    const result = findLinked(me, 'father', (person) => person.name === '누구세요');
    expect(result).toBeUndefined();
  });

  test('should find linked object itself with self option', () => {
    const result = findLinked(me, 'father', (person) => person.name === '나', { self: true });
    expect(result).toBe(me);
  });

  test('should return undefined if find itself without self option', () => {
    const result = findLinked(me, 'father', (person) => person.name === '나');
    expect(result).toBeUndefined();
  });

  test('should find deep linked object', () => {
    const result = findLinked(me, 'father', (person) => person.name === '할아버지');
    expect(result).toBe(grandFather);
  });

  test('should find linked object with property getter and predicate', () => {
    const getParent = (person?: Person) => (person?.mother ? 'mother' : 'father');
    const result = findLinked(me, getParent, (person) => person.name === '엄마');
    expect(result).toBe(mother);
  });
});
