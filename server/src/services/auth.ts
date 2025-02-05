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

  if (req.headers.authorization) {
    token = token.split(' ').pop().trim();
  }

  if (!token) {
    return req;
  }

  // token = token.split(' ')[1];
  // const secretKey = process.env.JWT_SECRET_KEY || '';
  //console.log(secretKey);
  // console.log(token);
  try {
    const {data} : any = jwt.verify(token, process.env.JWT_SECRET_KEY || '', { maxAge: '1hr'});
    req.user = data as JwtPayload
   } catch (err) {
    throw new Error('Invalid token');
  }
  return req;
};

export const signToken = (username: string, email: string, _id: unknown) => {
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