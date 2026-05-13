FROM serversideup/php:8.5-fpm-nginx AS build

USER root

RUN install-php-extensions exif gd \
    && apt-get update \
    && apt-get install -y curl gnupg ca-certificates git unzip \
    && curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY composer.json composer.lock ./
RUN composer install --no-scripts --no-autoloader --prefer-dist --no-interaction

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
COPY .env.docker .env

RUN composer dump-autoload --optimize \
    && npm run build \
    && rm -rf node_modules .env


FROM serversideup/php:8.5-fpm-nginx

USER root
RUN install-php-extensions exif gd \
    && apt-get update \
    && apt-get install -y osm2pgsql \
    && rm -rf /var/lib/apt/lists/*

COPY --chown=www-data:www-data --from=build /app /var/www/html

USER www-data
WORKDIR /var/www/html
