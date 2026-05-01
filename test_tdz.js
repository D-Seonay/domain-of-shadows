function test() {
  const a = 1;
  const b = (() => a + 1)();
  console.log(b);
}
test();
