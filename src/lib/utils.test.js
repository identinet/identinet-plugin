import { expect, test } from "vitest";
import { property2humanreadable } from "./utils.js";

test("property2humanreadable - When property name is empty, ensure it stays empty.", () => {
  const res = property2humanreadable("");
  expect(res.length).toBe(0);
});

test("property2humanreadable - When property name is non-empty, ensure it the first characters is turn uppercase.", () => {
  const res = property2humanreadable("abc");
  expect(res).toBe("Abc");
});

test("property2humanreadable - When property name is upper case, ensure it stays uppercase.", () => {
  const res = property2humanreadable("ABC");
  expect(res).toBe("ABC");
});

test("property2humanreadable - When property name starts with a namespace, ensure it gets stripped.", () => {
  const res = property2humanreadable("ns:abc");
  expect(res).toBe("Abc");
});

test("property2humanreadable - When property name contains a colon, ensure it isn't stripped.", () => {
  const res = property2humanreadable("ns:a:bc");
  expect(res).toBe("A:bc");
});
