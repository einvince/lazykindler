import styled from 'styled-components';

import OptionTitle from './OptionTitle';
import OptionValue from './OptionValue';
// components
import OptionWrapper from './OptionWrapper';
import SliderValue from './SliderValue';

const Slider = ({ active, title, minValue, maxValue, defaultValue, step, onChange }: Props) => {
    const onChangeValue = (e: any) => {
        if (!active) return;
        onChange(e);
    };

    return (
        <OptionWrapper>
            <OptionTitle>{title}</OptionTitle>

            <SliderWrapper>
                <OptionValue active={active}>{defaultValue}</OptionValue>
                <SliderValue
                    active={active}
                    minValue={minValue}
                    maxValue={maxValue}
                    defaultValue={defaultValue}
                    step={step}
                    onChange={onChangeValue}
                />
            </SliderWrapper>
        </OptionWrapper>
    );
};

const SliderWrapper = styled.div`
    display: flex;
    align-items: center;
    height: 20px;
`;

interface Props {
    active: boolean;
    title: string;
    minValue: number;
    maxValue: number;
    defaultValue: number;
    step: number;
    onChange: (e: any) => void;
}

export default Slider;
