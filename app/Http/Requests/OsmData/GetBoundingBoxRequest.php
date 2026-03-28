<?php

namespace App\Http\Requests\OsmData;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class GetBoundingBoxRequest extends FormRequest
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
            'west' => ['required', 'numeric'],
            'south' => ['required', 'numeric'],
            'east' => ['required', 'numeric'],
            'north' => ['required', 'numeric'],
        ];
    }

    protected function passedValidation(): void
    {
        $this->merge([
            'west' => (float) $this->west,
            'south' => (float) $this->south,
            'east' => (float) $this->east,
            'north' => (float) $this->north,
        ]);
    }
}
