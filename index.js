module.exports = (opts = {}) => {
  return {
    postcssPlugin: "tailwindcss-dynamicvars",
    Rule(rule, { Rule }) {
      const match = rule.selector.match(/\$\\\{([a-zA-Z0-9]+)\\\}/);
      if (match) {
        const varname = match?.[1];
        const sel = rule.selector;
        const isRangeOrDefaultRrange =
          opts?.ranges?.[varname] ||
          (opts?.default?.range && !opts?.values?.[varname]);
        const isValueOrDefaultValue =
          opts?.values?.[varname] || opts?.default?.values;
        const [startRange = 0, endRange = 10] =
          opts?.ranges?.[varname] || opts?.default?.range;

        if (rule?.nodes?.find((node) => node?.value.includes(varname))) {
          // if rule declaration has this varname we can not combine all rules by ', ' and
          // instead have to write all of them out wiht different declaration values
          if (isRangeOrDefaultRrange) {
            // create and append new rules
            Array(endRange - startRange)
              .fill(undefined)
              .forEach((_, i) => {
                const cloned = rule.cloneAfter();
                // reverse the index (by subtracting idx from endRange) so we can count from top and append after in correct order
                const idx = endRange - i + startRange;
                cloned?.nodes?.forEach(
                  (node) =>
                    (node.value = node?.value?.replaceAll(
                      `\$\{${varname}\}`,
                      idx
                    ))
                );
                cloned.selector = sel.replaceAll(`\\$\\{${varname}\\}`, idx);
              });
            // override existing rule with first range element
            rule.selector = sel.replaceAll(`\\$\\{${varname}\\}`, startRange);
            rule?.nodes?.forEach(
              (node) =>
                (node.value = node?.value?.replaceAll(
                  `\$\{${varname}\}`,
                  startRange
                ))
            );
          } else if (isValueOrDefaultValue) {
            // create and append new rules
            const values = opts?.values?.[varname] || opts?.default?.values;
            values
              ?.slice(1)
              ?.reverse()
              ?.forEach((v) => {
                const cloned = rule.cloneAfter();
                cloned?.nodes?.forEach(
                  (node) =>
                    (node.value = node?.value?.replaceAll(
                      `\$\{${varname}\}`,
                      v
                    ))
                );
                cloned.selector = sel.replaceAll(`\\$\\{${varname}\\}`, v);
              });
            // override existing rule with first range element
            rule.selector = sel.replaceAll(`\\$\\{${varname}\\}`, values?.[0]);
            rule?.nodes?.forEach(
              (node) =>
                (node.value = node?.value?.replaceAll(
                  `\$\{${varname}\}`,
                  values?.[0]
                ))
            );
          }
        } else {
          // all selectors have the same declaration and can be grouped together
          if (isRangeOrDefaultRrange) {
            const newSelectors = Array(endRange - startRange + 1)
              .fill(undefined)
              .map((_, i) =>
                sel.replaceAll(`\\$\\{${varname}\\}`, i + startRange)
              );
            rule.selector = newSelectors.join(", ");
          } else if (isValueOrDefaultValue) {
            const values = opts?.values?.[varname] || opts?.default?.values;
            const newSelectors = values?.map((v) =>
              sel.replaceAll(`\\$\\{${varname}\\}`, v)
            );
            rule.selector = newSelectors.join(", ");
          }
        }
      }
    },
  };
};
module.exports.postcss = true;
