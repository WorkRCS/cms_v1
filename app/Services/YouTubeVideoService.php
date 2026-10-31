<?php

namespace App\Services;

use Illuminate\Validation\ValidationException;

class YouTubeVideoService
{
    public function fromUrl(string $url, string $layout = 'auto', ?string $title = null): array
    {
        $url = trim($url);
        $parts = parse_url($url);
        $host = strtolower((string) ($parts['host'] ?? ''));
        $path = (string) ($parts['path'] ?? '');
        $query = [];
        parse_str((string) ($parts['query'] ?? ''), $query);

        $allowedHosts = [
            'youtube.com',
            'www.youtube.com',
            'm.youtube.com',
            'youtu.be',
            'www.youtu.be',
            'youtube-nocookie.com',
            'www.youtube-nocookie.com',
        ];

        if (! in_array($host, $allowedHosts, true)) {
            throw ValidationException::withMessages([
                'video_youtube_url' => ['Enter a valid YouTube video, Shorts or youtu.be link.'],
            ]);
        }

        $videoId = null;
        $isShortsUrl = false;

        if (in_array($host, ['youtu.be', 'www.youtu.be'], true)) {
            $videoId = trim($path, '/');
        } elseif (! empty($query['v'])) {
            $videoId = (string) $query['v'];
        } elseif (preg_match('~^/(shorts|embed|live)/([^/?]+)~', $path, $matches)) {
            $isShortsUrl = $matches[1] === 'shorts';
            $videoId = $matches[2];
        }

        if (! is_string($videoId) || ! preg_match('/^[A-Za-z0-9_-]{11}$/', $videoId)) {
            throw ValidationException::withMessages([
                'video_youtube_url' => ['The YouTube link does not contain a valid video ID.'],
            ]);
        }

        if (! in_array($layout, ['auto', 'shorts', 'standard'], true)) {
            $layout = 'auto';
        }

        $resolvedLayout = $layout === 'auto'
            ? ($isShortsUrl ? 'shorts' : 'standard')
            : $layout;

        return [
            'type' => 'youtube',
            'provider' => 'youtube',
            'video_id' => $videoId,
            'url' => 'https://www.youtube.com/watch?v='.$videoId,
            'embed_url' => 'https://www.youtube-nocookie.com/embed/'.$videoId.'?playsinline=1&rel=0',
            'thumbnail_url' => 'https://i.ytimg.com/vi/'.$videoId.'/hqdefault.jpg',
            'layout' => $resolvedLayout,
            'title' => trim((string) $title) !== '' ? trim((string) $title) : null,
        ];
    }
}
