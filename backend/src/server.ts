import app from './app';
import path from 'path';
import dotenv from 'dotenv';
import express from 'express';

dotenv.config({
  path: path.resolve(__dirname, '../.env')
});
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`API listening on port ${PORT}`);
});
