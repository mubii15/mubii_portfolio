# backend/Dockerfile
FROM php:8.2-apache

# Install system dependencies for GD (WebP, JPEG, PNG support)
RUN apt-get update && apt-get install -y \
    libwebp-dev \
    libjpeg62-turbo-dev \
    libpng-dev \
    libfreetype6-dev \
    && rm -rf /var/lib/apt/lists/*

# Configure and install GD with WebP + JPEG + PNG support
RUN docker-php-ext-configure gd \
    --with-freetype \
    --with-jpeg \
    --with-webp \
    && docker-php-ext-install gd

# Install PDO MySQL extension
RUN docker-php-ext-install pdo pdo_mysql

# Enable Apache mod_rewrite (if needed for routing)
RUN a2enmod rewrite

# Set working directory
WORKDIR /var/www/html

# Copy backend files
COPY . /var/www/html/

# Create uploads directories and give Apache (www-data) write access
RUN mkdir -p /var/www/html/uploads/img /var/www/html/uploads/thumbnails \
    && chown -R www-data:www-data /var/www/html/uploads \
    && chmod -R 775 /var/www/html/uploads

# Expose port 80
EXPOSE 80

