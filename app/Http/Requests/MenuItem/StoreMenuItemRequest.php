<?php

namespace App\Http\Requests\MenuItem;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class StoreMenuItemRequest extends FormRequest
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
        $osmData = $this->route('osmData');

        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('menu_items', 'name')->where(function ($query) use ($osmData) {
                    return $query->where('osm_data_id', $osmData->id);
                })],
            'description' => ['nullable', 'string', 'max:2000'],
            'allergens' => ['nullable', 'array'],
            'allergens.*' => ['integer', 'exists:allergens,id'],
            'dietary_tags' => ['nullable', 'array'],
            'dietary_tags.*' => ['integer', 'exists:dietary_tags,id'],
            'photo' => ['nullable', 'file', 'image', 'max:'.$maxPhotoSizeInKilobytes],
        ];
    }
}
