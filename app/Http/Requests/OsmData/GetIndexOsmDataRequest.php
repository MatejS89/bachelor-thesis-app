<?php

namespace App\Http\Requests\OsmData;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class GetIndexOsmDataRequest extends FormRequest
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
            'south' => 'required_with:west,north,east|numeric|nullable',
            'west' => 'required_with:south,north,east|numeric|nullable',
            'north' => 'required_with:south,west,east|numeric|nullable',
            'east' => 'required_with:south,west,north|numeric|nullable',

            'search' => 'string|nullable',
        ];
    }
}
