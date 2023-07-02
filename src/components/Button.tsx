import styled from 'styled-components';

const StyledButton = styled.button`
  border: 1px solid #000;
  background-color: #fff;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 2px;
  &:hover {
    background-color: #f5f5f5;
  }
`;

interface ButtonPropsType
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
}

const Button = (props: ButtonPropsType) => {
  const { label, ...rest } = props;

  return <StyledButton {...rest}>{label}</StyledButton>;
};

export default Button;
