import { combiineToLines } from "./../modules/combineToLines"

test("combineToLines", () => {
  const md = `
ほげ：ふが
     ふがふが
     ふがふがふが
ぴよ：ふが
     ふがふが
     ふがふがふが
  `
  const lines = combiineToLines(md)
  expect(lines).toHaveLength(2)
  expect(lines[0]).toEqual("ほげ：ふが\nふがふが\nふがふがふが")
})
