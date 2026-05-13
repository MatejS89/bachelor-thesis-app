<?php

namespace App\Http\Requests\Review;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StoreReviewRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Auth::check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        $maxPhotoSizeInKilobytes = config('file-uploads.max_photo_size_in_kb');
        $maxPhotoCount = config('file-uploads.max_review_photos');

        return [
            'rating' => ['required', 'integer', 'between:1,5'],
            'description' => ['nullable', 'string', 'max:1000'],
            'photos' => ['array', 'max:'.$maxPhotoCount],
            'photos.*' => ['image', 'max:'.$maxPhotoSizeInKilobytes],
        ];
    }
}
