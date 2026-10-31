<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use RuntimeException;

class ProductImageService
{
    /**
     * @param array<int, UploadedFile> $files
     * @return array<int, array<string, mixed>>
     */
    public function store(array $files, string $productName): array
    {
        if (! extension_loaded('gd') || ! function_exists('imagewebp')) {
            throw new RuntimeException('PHP GD with WebP support must be enabled to upload product images.');
        }

        $results = [];
        foreach ($files as $index => $file) {
            $results[] = $this->storeOne($file, $productName, $index);
        }

        return $results;
    }

    private function storeOne(UploadedFile $file, string $productName, int $index): array
    {
        $binary = file_get_contents($file->getRealPath());
        $source = $binary === false ? false : @imagecreatefromstring($binary);

        if ($source === false) {
            throw new RuntimeException('One of the uploaded files is not a readable image.');
        }

        $sourceWidth = imagesx($source);
        $sourceHeight = imagesy($source);
        $folder = 'products/'.Str::uuid();
        $variants = [];

        foreach (['thumbnail' => 320, 'medium' => 640, 'large' => 1200] as $variant => $maxEdge) {
            $scale = min(1, $maxEdge / max($sourceWidth, $sourceHeight));
            $width = max(1, (int) round($sourceWidth * $scale));
            $height = max(1, (int) round($sourceHeight * $scale));

            $canvas = imagecreatetruecolor($width, $height);
            imagealphablending($canvas, false);
            imagesavealpha($canvas, true);
            $transparent = imagecolorallocatealpha($canvas, 0, 0, 0, 127);
            imagefilledrectangle($canvas, 0, 0, $width, $height, $transparent);
            imagecopyresampled($canvas, $source, 0, 0, 0, 0, $width, $height, $sourceWidth, $sourceHeight);

            ob_start();
            $written = imagewebp($canvas, null, $variant === 'thumbnail' ? 78 : 82);
            $webp = ob_get_clean();
            imagedestroy($canvas);

            if (! $written || ! is_string($webp) || $webp === '') {
                imagedestroy($source);
                throw new RuntimeException('The server could not encode an uploaded image as WebP.');
            }

            $path = $folder.'/'.$variant.'.webp';
            Storage::disk('public')->put($path, $webp);
            $variants[$variant] = Storage::disk('public')->url($path);
        }

        imagedestroy($source);

        return [
            'url' => $variants['large'],
            'alt' => trim($productName).' image '.($index + 1),
            'is_primary' => $index === 0,
            'sort_order' => $index + 1,
            'width' => min(1200, $sourceWidth),
            'height' => (int) round($sourceHeight * min(1, 1200 / max($sourceWidth, $sourceHeight))),
            'format' => 'webp',
            'variants' => $variants,
        ];
    }
}
