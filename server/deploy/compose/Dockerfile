# Vellmont careers API — built from the exact reviewed PR head (see DEPLOYED_SHA).
FROM node:22-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY shared ./shared
COPY server/package.json server/package-lock.json ./server/
RUN cd server && npm ci --omit=dev --no-audit --no-fund
COPY server ./server
USER node
WORKDIR /app/server
CMD ["node", "src/index.js"]
