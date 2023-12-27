/**
 * 将字符数组转换成数字
 * @param nums
 */
export const resolveArrayStringToNumber = (nums: number[]) => {
  const res = nums.map((item) => +item);
  if (res.some((item) => Number.isNaN(item))) {
    return false;
  }
  return res;
};
