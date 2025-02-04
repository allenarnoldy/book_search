import jwt from 'jsonwebtoken';
import { GraphQLError } from 'graphql';
import dotenv from 'dotenv';
import { Request } from 'express';
dotenv.config();

interface JwtPayload {
  _id: string;
  username: string;
  email: string,
}

export const authenticateToken = async ({req}: {req:Request}) => {
  let token = req.headers.authorization || req.body.token || req.query.token;

  if (!token) {
    throw new Error('Header is missing');
  }

  token = token.split(' ')[1];
  const secretKey = process.env.JWT_SECRET_KEY || '';
  console.log(secretKey);
  console.log(token);
  try {
    var user = jwt.verify(token, secretKey) as JwtPayload;
    req.headers._id = user._id;
  } catch (err) {
    throw new Error('Invalid token');
  }
  return {_id: req.headers._id}//req.headers._id;
};

export const signToken = (username: string, email: string, _id: string) => {
  const payload = { username, email, _id };
  const secretKey = process.env.JWT_SECRET_KEY || '';

  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};

export class AuthenticationError extends GraphQLError {
  constructor(message: string) {
    super(message, undefined, undefined, undefined, ['UNAUTHENTICATED']);
    Object.defineProperty(this, 'name', { value: 'AuthenticationError' });
  }
};