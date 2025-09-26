import jwt from 'jsonwebtoken';

export const generateTokens = (user) => {
  // Access token - short lived (15 minutes)
  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );

  // Refresh token - long lived (7 days)
  const refreshToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};

export const verifyToken = (token, isRefreshToken = false) => {
  try {
    const secret = isRefreshToken ? process.env.JWT_REFRESH_SECRET : process.env.JWT_SECRET;
    return jwt.verify(token, secret);
  } catch (error) {
    throw new Error('Invalid token');
  }
};

export default {
  generateTokens,
  verifyToken
};