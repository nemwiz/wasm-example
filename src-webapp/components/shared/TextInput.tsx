import React, {ChangeEvent, FC} from 'react';

interface TextInputProps {
    onChangeCallback: (event: ChangeEvent<HTMLInputElement>) => void;
}

const TextInput: FC<TextInputProps> = (({onChangeCallback}) => {
    return (
        <div className='form__group field'>
            <input type='input'
                   className='form__field'
                   placeholder='Item type'
                   name='item-type'
                   id='item-type'
                   onChange={onChangeCallback}
                   required/>
            <label htmlFor='item-type' className='form__label'>Item type</label>
        </div>
    );
});

export default TextInput;
