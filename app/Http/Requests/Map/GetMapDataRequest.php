<?php

namespace App\Http\Requests\Map;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class GetMapDataRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if (! $this->has('bbox')) {
            return;
        }

        $coords = explode(',', $this->input('bbox'));

        if (count($coords) === 4) {
            $this->merge([
                'west' => $coords[0],
                'south' => $coords[1],
                'east' => $coords[2],
                'north' => $coords[3],
            ]);
        }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'bbox' => ['required', 'string'],

            'west' => ['required', 'numeric'],
            'south' => ['required', 'numeric'],
            'east' => ['required', 'numeric'],
            'north' => ['required', 'numeric'],
        ];
    }
}
