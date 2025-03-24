const a = {
  b: {
    c: {
      d: {
        e: {
          f: "Name",
          g: ["P", "S", "C", {
            a: "something"
          }]
        }
      }
    }
  }
}

// const getNestedValue = (obj, path) => path.split('.').reduce((current, key) => (current === null || current === undefined) ? null : current[key], obj);

const getNestedValue = (obj, path) => {
  return path.split('.')
    .reduce((current, key) => {
      if (current === null || current === undefined) return null;
      const match = key.match(/^(.*?)\[(\d+)\]$/);
      if (match) {
        const [, arrayKey, index] = match;
        return current[arrayKey]?.[parseInt(index)] ?? null;
      }
      return current[key] ?? null;
    }, obj);
};


console.log(getNestedValue(a, "b.c.d.e.f"))

console.log(getNestedValue(a, "b.c.d.e.g[0]"))
console.log(getNestedValue(a, "b.c.d.e.g[3].a"))
