const m_w_default = 123456789;
const m_z_default = 987654321;
const mask = 0xffffffff;

// Returns number between 0 (inclusive) and 1.0 (exclusive)
export const getRandomIntegerWithSeed = (seed: number): number => {
  let m_w = (m_w_default + seed) & mask;
  let m_z = (m_z_default - seed) & mask;
  
  m_z = (36969 * (m_z & 65535) + (m_z >> 16)) & mask;
  m_w = (18000 * (m_w & 65535) + (m_w >> 16)) & mask;

  let result = ((m_z << 16) + (m_w & 65535)) >>> 0;
  result /= 4294967296;

  return result;
}
