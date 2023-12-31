import { useEffect, useState } from "react";
import "./App.css";
import RadioGroup from "./RadioGroup";
import mockResponse, { MockResponse } from "./mockresponse";

const isDisabled = (index: number, selected: Record<string, { id: number; value: string }> = {}) => {
  if (index === 0) {
    return false;
  }

  if (selected[`group${index - 1}`] != null) {
    return false;
  }

  return true;
};

const App = () => {
  const [data, setData] = useState<MockResponse | null>(null);
  const [rules, setRules] = useState<Array<number>>([]);
  const [selected, setSelected] = useState<Record<string, { id: number; value: string }>>({});

  useEffect(() => {
    mockResponse().then((data) => setData(data));
  }, []);

  if (!data) {
    return <span>Loading...</span>;
  }

  const handleOnChange = (id: number, name: string, value: string) => {
    let currentRules: number[] = [];
    setRules((prev) => {
      currentRules = [...prev];
      if (selected[name] != null && Array.isArray(data.rules[selected[name].id])) {
        //remove previous rules if there are any
        currentRules = currentRules.filter((val) => !data.rules[selected[name].id].includes(val));
      }

      //push new rule if there are any
      if (Array.isArray(data.rules[id])) currentRules.push(...data.rules[id]);

      for (const key in selected) {
        //remove children rules that are affected by previous group
        if (currentRules.includes(selected[key].id) && Array.isArray(data.rules[selected[name].id])) {
          currentRules = currentRules.filter((val) => !data.rules[selected[name].id].includes(val));
        }
      }

      return currentRules;
    });

    setSelected((prev) => {
      const selected = { ...prev, [name]: { id, value } };
      for (const key in selected) {
        if (currentRules.includes(selected[key].id)) {
          delete selected[key];
        }
      }

      return selected;
    });
  };

  const handleSubmit = () => {
    let selectedMenu = "";

    for (const key in selected) {
      selectedMenu += `${selected[key].value} `;
    }

    alert(`You have selected: ${selectedMenu}`);
  };

  const handleReset = () => {
    setSelected({});
    setRules([]);
  };

  return (
    <>
      {data?.menus?.map((option, index) => {
        const disabled = isDisabled(index, selected);
        const name = `group${index}`;
        const selectedIdPerGroup = selected[`group${index}`]?.id;
        return (
          <div key={name} style={{ marginBottom: "40px" }}>
            <RadioGroup RadioGroupOption={option} selected={selectedIdPerGroup} name={name} handleOnChange={handleOnChange} rules={rules} disabled={disabled} />
          </div>
        );
      })}
      <button disabled={Object.keys(selected).length < data.menus.length} onClick={handleSubmit}>
        Submit
      </button>
      <button onClick={handleReset}>Reset</button>
    </>
  );
};

export default App;
