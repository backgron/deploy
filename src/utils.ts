/**
 *  Date转时分秒
 * @param date Date对象
 * @returns 时:分:秒
 */
export function getTime(date: Date): string {
  let h: string | number = date.getHours()
  let m: string | number = date.getMinutes()
  let s: string | number = date.getSeconds()

  h = h < 10 ? "0" + h : h
  m = m < 10 ? "0" + m : m
  s = s < 10 ? "0" + s : s

  return `${h}:${m}:${s}`
}

/**
 * 返回以秒为单位的时间差字符串： 100s
 * @param startTime 开始时间
 * @param endTime 结束时间
 * @returns 时间差 （秒）
 */
export function getDeltaT(startTime: Date, endTime: Date): string {
  const res = (endTime.getTime() - startTime.getTime()) / 1000
  return `${res}s`
}
