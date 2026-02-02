/**
 * @leetCode Longest Common Prefix
 */

const longestCommonPrefix = function (str) {
  if (!str.length) return "";

  let prefix = str[0];

  for (let i = 1; i < str.length; i++) {
    while (str[i].indexOf(prefix) !== 0) {
      prefix = prefix.slice(0, -1);
      if (prefix === "") return "";
    }
  }

  return prefix;
};
