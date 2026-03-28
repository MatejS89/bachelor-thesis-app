<?php

namespace App\Http\Requests\OsmData;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateFeatureRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'images' => ['array', 'max:10'],
            'images.*' => ['image', 'mimes:jpeg,png,jpg,gif,svg', 'max:10240'],
        ];
    }

    public function messages(): array
    {
        $messages = [
            'images.max' => 'you cannot upload more than 10 photos at once.',
            'images.*.max' => 'the :position image is too large! please keep it under 10mb.',
            'images.*.mimes' => 'the :position file must be a standard image format (jpg, png, jpeg, gif, svg).',
            'images.*.image' => 'the :position file is corrupted or not a valid image.',
            'images.*.uploaded' => 'the :position image failed to upload. It might be too large for the server.',
        ];

        return collect($messages)
            ->map(fn ($message) => "Error: {$message}")
            ->toArray();
    }
}
