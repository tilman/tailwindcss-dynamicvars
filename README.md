## config postcss.config.js

```
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    "tailwindcss-dynamicvars": {
      // 
      ranges: {
        subnavIndex: [0, 3],
        subsubnavIndex: [0, 30],
      },
      values: {
        someOtherIndex: ["a", "b", "c"],
      },
      default: {
        range: [0, 10],
        // or
        // values: ["first", "second", "third"]
      },
    },
  },
};
```

Supports numeric ranges and predefined values. Will replace dynamic elements in template strings with your predefined vars during postcss build time.
For example the class `md:group-hover/subnav-${subnavIndex}:h-auto` would become `md:group-hover/subnav-**1**:h-auto, md:group-hover/subnav-**2**:h-auto, md:group-hover/subnav-**3**:h-auto`

For predefined values `group-hover/hello-${someOtherIndex}:w-full` would become `group-hover/hello-a:w-full, group-hover/hello-b:w-full, group-hover/hello-c:w-full`

If no ranges or values key matches your variable name (For example `someVariableName` in template string `${someVariableName}`) from the postcss config. Then the default range or values are used. 

Calculations or expressions in template strings (Like `${i * 10}` or `${Number(i)}`) are currently not supported yet. Instead you can do the calculation and safe it to a variable and use this one (Like `const n = i * 10;` and the use `${n}` in your className).