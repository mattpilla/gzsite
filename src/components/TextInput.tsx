import styled from 'styled-components';

const StyledInput = styled.input`
  border: 1px solid #777;
  padding: 2px 4px;
`;

interface TextInputPropsType
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const TextInput = (props: TextInputPropsType) => {
  const { ...rest } = props;

  return <StyledInput {...rest} />;
};

export default TextInput;
