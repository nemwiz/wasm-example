import React, {FC} from "react";

const Hello: FC<{name: string}> = (({name}) => {
    return (<div>Hi there {name}</div>);
});

export default Hello;
