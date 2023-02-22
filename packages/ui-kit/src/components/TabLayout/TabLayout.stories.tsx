import Row from "../grid/Row";
import Column from "../grid/Column";
import Resizable from "../grid/Resizable";
import  RootContainer from "../grid/Resizable";

export default {
  title: "UI-Kit/TabLayout",
  component: RootContainer,
  subComponent: Row, Column, Resizable,
  argTypes: {
    className: 'bg-black'
  }
};


const TabLayout = (args: any) => {
  return (
    <div className="w-full h-96 border border-appBorder">
        <RootContainer>
            <Row className="flex flex-col h-full">
                <Column className="border-b border-appBorder">URLBAR</Column>
                <Column flex={1}>
                    <Row className="h-full">
                        <Column flex={1}>Request Body</Column>
                        <Resizable left={true} maxWidth="90%" minWidth={200} width="50%">
                            <Column flex={1} className="border-l border-appBorder">Responce Body</Column>
                        </Resizable>
                    </Row>
                </Column>
            </Row>
        </RootContainer>
    </div>
  )
};

export const TabLayoutSimple = TabLayout.bind({});
