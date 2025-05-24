/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import {
  Autocomplete,
  Badge,
  Button,
  Divider,
  Flex,
  Grid,
  Icon,
  ScrollView,
  SwitchField,
  Text,
  TextField,
  useTheme,
} from "@aws-amplify/ui-react";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { generateClient } from "aws-amplify/api";
import { getClient, getCreations, listClients } from "../graphql/queries";
import { updateCreations } from "../graphql/mutations";
const client = generateClient();
function ArrayField({
  items = [],
  onChange,
  label,
  inputFieldRef,
  children,
  hasError,
  setFieldValue,
  currentFieldValue,
  defaultFieldValue,
  lengthLimit,
  getBadgeText,
  runValidationTasks,
  errorMessage,
}) {
  const labelElement = <Text>{label}</Text>;
  const {
    tokens: {
      components: {
        fieldmessages: { error: errorStyles },
      },
    },
  } = useTheme();
  const [selectedBadgeIndex, setSelectedBadgeIndex] = React.useState();
  const [isEditing, setIsEditing] = React.useState();
  React.useEffect(() => {
    if (isEditing) {
      inputFieldRef?.current?.focus();
    }
  }, [isEditing]);
  const removeItem = async (removeIndex) => {
    const newItems = items.filter((value, index) => index !== removeIndex);
    await onChange(newItems);
    setSelectedBadgeIndex(undefined);
  };
  const addItem = async () => {
    const { hasError } = runValidationTasks();
    if (
      currentFieldValue !== undefined &&
      currentFieldValue !== null &&
      currentFieldValue !== "" &&
      !hasError
    ) {
      const newItems = [...items];
      if (selectedBadgeIndex !== undefined) {
        newItems[selectedBadgeIndex] = currentFieldValue;
        setSelectedBadgeIndex(undefined);
      } else {
        newItems.push(currentFieldValue);
      }
      await onChange(newItems);
      setIsEditing(false);
    }
  };
  const arraySection = (
    <React.Fragment>
      {!!items?.length && (
        <ScrollView height="inherit" width="inherit" maxHeight={"7rem"}>
          {items.map((value, index) => {
            return (
              <Badge
                key={index}
                style={{
                  cursor: "pointer",
                  alignItems: "center",
                  marginRight: 3,
                  marginTop: 3,
                  backgroundColor:
                    index === selectedBadgeIndex ? "#B8CEF9" : "",
                }}
                onClick={() => {
                  setSelectedBadgeIndex(index);
                  setFieldValue(items[index]);
                  setIsEditing(true);
                }}
              >
                {getBadgeText ? getBadgeText(value) : value.toString()}
                <Icon
                  style={{
                    cursor: "pointer",
                    paddingLeft: 3,
                    width: 20,
                    height: 20,
                  }}
                  viewBox={{ width: 20, height: 20 }}
                  paths={[
                    {
                      d: "M10 10l5.09-5.09L10 10l5.09 5.09L10 10zm0 0L4.91 4.91 10 10l-5.09 5.09L10 10z",
                      stroke: "black",
                    },
                  ]}
                  ariaLabel="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    removeItem(index);
                  }}
                />
              </Badge>
            );
          })}
        </ScrollView>
      )}
      <Divider orientation="horizontal" marginTop={5} />
    </React.Fragment>
  );
  if (lengthLimit !== undefined && items.length >= lengthLimit && !isEditing) {
    return (
      <React.Fragment>
        {labelElement}
        {arraySection}
      </React.Fragment>
    );
  }
  return (
    <React.Fragment>
      {labelElement}
      {isEditing && children}
      {!isEditing ? (
        <>
          <Button
            onClick={() => {
              setIsEditing(true);
            }}
          >
            Add item
          </Button>
          {errorMessage && hasError && (
            <Text color={errorStyles.color} fontSize={errorStyles.fontSize}>
              {errorMessage}
            </Text>
          )}
        </>
      ) : (
        <Flex justifyContent="flex-end">
          {(currentFieldValue || isEditing) && (
            <Button
              children="Cancel"
              type="button"
              size="small"
              onClick={() => {
                setFieldValue(defaultFieldValue);
                setIsEditing(false);
                setSelectedBadgeIndex(undefined);
              }}
            ></Button>
          )}
          <Button size="small" variation="link" onClick={addItem}>
            {selectedBadgeIndex !== undefined ? "Save" : "Add"}
          </Button>
        </Flex>
      )}
      {arraySection}
    </React.Fragment>
  );
}
export default function CreationsUpdateForm(props) {
  const {
    id: idProp,
    creations: creationsModelProp,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    prompt: "",
    costprompt: "",
    gender: "",
    jewellrytype: "",
    material: "",
    kwt: "",
    stone: "",
    grade: "",
    Gemsource: "",
    ringsize: "",
    Style: "",
    ringstyle: "",
    gemsize: "",
    cut: "",
    url: "",
    colour: "",
    shape: "",
    accepteddate: "",
    ipaddress: "",
    outstandingbalance: "",
    requiredby: "",
    Estimatecostfrom: "",
    Estimatecostto: "",
    lastupdate: "",
    status: "",
    submittedforquote: false,
    submittedfororder: false,
    termsaccepted: false,
    amontquoted: "",
    submitteddate: "",
    clarity: "",
    bandwidth: "",
    Prompt_Strength: "",
    Similarity_Strength: "",
    seedurl: "",
    Necklace_Length: "",
    Bracelet_Length: "",
    Secondary_Gemstone: "",
    Earring_Fastening_Types: "",
    Bracelet_Clasp_Types: "",
    Ring_Band_Style: "",
    Ring_Setting: "",
    Necklace_Chain_Style: "",
    Bracelet_Chain_Style: "",
    Brooch_Fastening_Types: "",
    Gem_Settings: "",
    Necklace_Clasp: "",
    clientID: undefined,
  };
  const [prompt, setPrompt] = React.useState(initialValues.prompt);
  const [costprompt, setCostprompt] = React.useState(initialValues.costprompt);
  const [gender, setGender] = React.useState(initialValues.gender);
  const [jewellrytype, setJewellrytype] = React.useState(
    initialValues.jewellrytype
  );
  const [material, setMaterial] = React.useState(initialValues.material);
  const [kwt, setKwt] = React.useState(initialValues.kwt);
  const [stone, setStone] = React.useState(initialValues.stone);
  const [grade, setGrade] = React.useState(initialValues.grade);
  const [Gemsource, setGemsource] = React.useState(initialValues.Gemsource);
  const [ringsize, setRingsize] = React.useState(initialValues.ringsize);
  const [Style, setStyle] = React.useState(initialValues.Style);
  const [ringstyle, setRingstyle] = React.useState(initialValues.ringstyle);
  const [gemsize, setGemsize] = React.useState(initialValues.gemsize);
  const [cut, setCut] = React.useState(initialValues.cut);
  const [url, setUrl] = React.useState(initialValues.url);
  const [colour, setColour] = React.useState(initialValues.colour);
  const [shape, setShape] = React.useState(initialValues.shape);
  const [accepteddate, setAccepteddate] = React.useState(
    initialValues.accepteddate
  );
  const [ipaddress, setIpaddress] = React.useState(initialValues.ipaddress);
  const [outstandingbalance, setOutstandingbalance] = React.useState(
    initialValues.outstandingbalance
  );
  const [requiredby, setRequiredby] = React.useState(initialValues.requiredby);
  const [Estimatecostfrom, setEstimatecostfrom] = React.useState(
    initialValues.Estimatecostfrom
  );
  const [Estimatecostto, setEstimatecostto] = React.useState(
    initialValues.Estimatecostto
  );
  const [lastupdate, setLastupdate] = React.useState(initialValues.lastupdate);
  const [status, setStatus] = React.useState(initialValues.status);
  const [submittedforquote, setSubmittedforquote] = React.useState(
    initialValues.submittedforquote
  );
  const [submittedfororder, setSubmittedfororder] = React.useState(
    initialValues.submittedfororder
  );
  const [termsaccepted, setTermsaccepted] = React.useState(
    initialValues.termsaccepted
  );
  const [amontquoted, setAmontquoted] = React.useState(
    initialValues.amontquoted
  );
  const [submitteddate, setSubmitteddate] = React.useState(
    initialValues.submitteddate
  );
  const [clarity, setClarity] = React.useState(initialValues.clarity);
  const [bandwidth, setBandwidth] = React.useState(initialValues.bandwidth);
  const [Prompt_Strength, setPrompt_Strength] = React.useState(
    initialValues.Prompt_Strength
  );
  const [Similarity_Strength, setSimilarity_Strength] = React.useState(
    initialValues.Similarity_Strength
  );
  const [seedurl, setSeedurl] = React.useState(initialValues.seedurl);
  const [Necklace_Length, setNecklace_Length] = React.useState(
    initialValues.Necklace_Length
  );
  const [Bracelet_Length, setBracelet_Length] = React.useState(
    initialValues.Bracelet_Length
  );
  const [Secondary_Gemstone, setSecondary_Gemstone] = React.useState(
    initialValues.Secondary_Gemstone
  );
  const [Earring_Fastening_Types, setEarring_Fastening_Types] = React.useState(
    initialValues.Earring_Fastening_Types
  );
  const [Bracelet_Clasp_Types, setBracelet_Clasp_Types] = React.useState(
    initialValues.Bracelet_Clasp_Types
  );
  const [Ring_Band_Style, setRing_Band_Style] = React.useState(
    initialValues.Ring_Band_Style
  );
  const [Ring_Setting, setRing_Setting] = React.useState(
    initialValues.Ring_Setting
  );
  const [Necklace_Chain_Style, setNecklace_Chain_Style] = React.useState(
    initialValues.Necklace_Chain_Style
  );
  const [Bracelet_Chain_Style, setBracelet_Chain_Style] = React.useState(
    initialValues.Bracelet_Chain_Style
  );
  const [Brooch_Fastening_Types, setBrooch_Fastening_Types] = React.useState(
    initialValues.Brooch_Fastening_Types
  );
  const [Gem_Settings, setGem_Settings] = React.useState(
    initialValues.Gem_Settings
  );
  const [Necklace_Clasp, setNecklace_Clasp] = React.useState(
    initialValues.Necklace_Clasp
  );
  const [clientID, setClientID] = React.useState(initialValues.clientID);
  const [clientIDLoading, setClientIDLoading] = React.useState(false);
  const [clientIDRecords, setClientIDRecords] = React.useState([]);
  const [selectedClientIDRecords, setSelectedClientIDRecords] = React.useState(
    []
  );
  const autocompleteLength = 10;
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = creationsRecord
      ? { ...initialValues, ...creationsRecord, clientID }
      : initialValues;
    setPrompt(cleanValues.prompt);
    setCostprompt(cleanValues.costprompt);
    setGender(cleanValues.gender);
    setJewellrytype(cleanValues.jewellrytype);
    setMaterial(cleanValues.material);
    setKwt(cleanValues.kwt);
    setStone(cleanValues.stone);
    setGrade(cleanValues.grade);
    setGemsource(cleanValues.Gemsource);
    setRingsize(cleanValues.ringsize);
    setStyle(cleanValues.Style);
    setRingstyle(cleanValues.ringstyle);
    setGemsize(cleanValues.gemsize);
    setCut(cleanValues.cut);
    setUrl(cleanValues.url);
    setColour(cleanValues.colour);
    setShape(cleanValues.shape);
    setAccepteddate(cleanValues.accepteddate);
    setIpaddress(cleanValues.ipaddress);
    setOutstandingbalance(cleanValues.outstandingbalance);
    setRequiredby(cleanValues.requiredby);
    setEstimatecostfrom(cleanValues.Estimatecostfrom);
    setEstimatecostto(cleanValues.Estimatecostto);
    setLastupdate(cleanValues.lastupdate);
    setStatus(cleanValues.status);
    setSubmittedforquote(cleanValues.submittedforquote);
    setSubmittedfororder(cleanValues.submittedfororder);
    setTermsaccepted(cleanValues.termsaccepted);
    setAmontquoted(cleanValues.amontquoted);
    setSubmitteddate(cleanValues.submitteddate);
    setClarity(cleanValues.clarity);
    setBandwidth(cleanValues.bandwidth);
    setPrompt_Strength(cleanValues.Prompt_Strength);
    setSimilarity_Strength(cleanValues.Similarity_Strength);
    setSeedurl(cleanValues.seedurl);
    setNecklace_Length(cleanValues.Necklace_Length);
    setBracelet_Length(cleanValues.Bracelet_Length);
    setSecondary_Gemstone(cleanValues.Secondary_Gemstone);
    setEarring_Fastening_Types(cleanValues.Earring_Fastening_Types);
    setBracelet_Clasp_Types(cleanValues.Bracelet_Clasp_Types);
    setRing_Band_Style(cleanValues.Ring_Band_Style);
    setRing_Setting(cleanValues.Ring_Setting);
    setNecklace_Chain_Style(cleanValues.Necklace_Chain_Style);
    setBracelet_Chain_Style(cleanValues.Bracelet_Chain_Style);
    setBrooch_Fastening_Types(cleanValues.Brooch_Fastening_Types);
    setGem_Settings(cleanValues.Gem_Settings);
    setNecklace_Clasp(cleanValues.Necklace_Clasp);
    setClientID(cleanValues.clientID);
    setCurrentClientIDValue(undefined);
    setCurrentClientIDDisplayValue("");
    setErrors({});
  };
  const [creationsRecord, setCreationsRecord] =
    React.useState(creationsModelProp);
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? (
            await client.graphql({
              query: getCreations.replaceAll("__typename", ""),
              variables: { id: idProp },
            })
          )?.data?.getCreations
        : creationsModelProp;
      const clientIDRecord = record ? record.clientID : undefined;
      const clientRecord = clientIDRecord
        ? (
            await client.graphql({
              query: getClient.replaceAll("__typename", ""),
              variables: { id: clientIDRecord },
            })
          )?.data?.getClient
        : undefined;
      setClientID(clientIDRecord);
      setSelectedClientIDRecords([clientRecord]);
      setCreationsRecord(record);
    };
    queryData();
  }, [idProp, creationsModelProp]);
  React.useEffect(resetStateValues, [creationsRecord, clientID]);
  const [currentClientIDDisplayValue, setCurrentClientIDDisplayValue] =
    React.useState("");
  const [currentClientIDValue, setCurrentClientIDValue] =
    React.useState(undefined);
  const clientIDRef = React.createRef();
  const getDisplayValue = {
    clientID: (r) => `${r?.firstName ? r?.firstName + " - " : ""}${r?.id}`,
  };
  const validations = {
    prompt: [],
    costprompt: [],
    gender: [],
    jewellrytype: [],
    material: [],
    kwt: [],
    stone: [],
    grade: [],
    Gemsource: [],
    ringsize: [],
    Style: [],
    ringstyle: [],
    gemsize: [],
    cut: [],
    url: [{ type: "URL" }],
    colour: [],
    shape: [],
    accepteddate: [],
    ipaddress: [{ type: "IpAddress" }],
    outstandingbalance: [],
    requiredby: [],
    Estimatecostfrom: [],
    Estimatecostto: [],
    lastupdate: [],
    status: [],
    submittedforquote: [],
    submittedfororder: [],
    termsaccepted: [],
    amontquoted: [],
    submitteddate: [],
    clarity: [],
    bandwidth: [],
    Prompt_Strength: [],
    Similarity_Strength: [],
    seedurl: [{ type: "URL" }],
    Necklace_Length: [],
    Bracelet_Length: [],
    Secondary_Gemstone: [],
    Earring_Fastening_Types: [],
    Bracelet_Clasp_Types: [],
    Ring_Band_Style: [],
    Ring_Setting: [],
    Necklace_Chain_Style: [],
    Bracelet_Chain_Style: [],
    Brooch_Fastening_Types: [],
    Gem_Settings: [],
    Necklace_Clasp: [],
    clientID: [{ type: "Required" }],
  };
  const runValidationTasks = async (
    fieldName,
    currentValue,
    getDisplayValue
  ) => {
    const value =
      currentValue && getDisplayValue
        ? getDisplayValue(currentValue)
        : currentValue;
    let validationResponse = validateField(value, validations[fieldName]);
    const customValidator = fetchByPath(onValidate, fieldName);
    if (customValidator) {
      validationResponse = await customValidator(value, validationResponse);
    }
    setErrors((errors) => ({ ...errors, [fieldName]: validationResponse }));
    return validationResponse;
  };
  const convertToLocal = (date) => {
    const df = new Intl.DateTimeFormat("default", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      calendar: "iso8601",
      numberingSystem: "latn",
      hourCycle: "h23",
    });
    const parts = df.formatToParts(date).reduce((acc, part) => {
      acc[part.type] = part.value;
      return acc;
    }, {});
    return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
  };
  const fetchClientIDRecords = async (value) => {
    setClientIDLoading(true);
    const newOptions = [];
    let newNext = "";
    while (newOptions.length < autocompleteLength && newNext != null) {
      const variables = {
        limit: autocompleteLength * 5,
        filter: {
          or: [{ firstName: { contains: value } }, { id: { contains: value } }],
        },
      };
      if (newNext) {
        variables["nextToken"] = newNext;
      }
      const result = (
        await client.graphql({
          query: listClients.replaceAll("__typename", ""),
          variables,
        })
      )?.data?.listClients?.items;
      var loaded = result.filter((item) => clientID !== item.id);
      newOptions.push(...loaded);
      newNext = result.nextToken;
    }
    setClientIDRecords(newOptions.slice(0, autocompleteLength));
    setClientIDLoading(false);
  };
  React.useEffect(() => {
    fetchClientIDRecords("");
  }, []);
  return (
    <Grid
      as="form"
      rowGap="15px"
      columnGap="15px"
      padding="20px"
      onSubmit={async (event) => {
        event.preventDefault();
        let modelFields = {
          prompt: prompt ?? null,
          costprompt: costprompt ?? null,
          gender: gender ?? null,
          jewellrytype: jewellrytype ?? null,
          material: material ?? null,
          kwt: kwt ?? null,
          stone: stone ?? null,
          grade: grade ?? null,
          Gemsource: Gemsource ?? null,
          ringsize: ringsize ?? null,
          Style: Style ?? null,
          ringstyle: ringstyle ?? null,
          gemsize: gemsize ?? null,
          cut: cut ?? null,
          url: url ?? null,
          colour: colour ?? null,
          shape: shape ?? null,
          accepteddate: accepteddate ?? null,
          ipaddress: ipaddress ?? null,
          outstandingbalance: outstandingbalance ?? null,
          requiredby: requiredby ?? null,
          Estimatecostfrom: Estimatecostfrom ?? null,
          Estimatecostto: Estimatecostto ?? null,
          lastupdate: lastupdate ?? null,
          status: status ?? null,
          submittedforquote: submittedforquote ?? null,
          submittedfororder: submittedfororder ?? null,
          termsaccepted: termsaccepted ?? null,
          amontquoted: amontquoted ?? null,
          submitteddate: submitteddate ?? null,
          clarity: clarity ?? null,
          bandwidth: bandwidth ?? null,
          Prompt_Strength: Prompt_Strength ?? null,
          Similarity_Strength: Similarity_Strength ?? null,
          seedurl: seedurl ?? null,
          Necklace_Length: Necklace_Length ?? null,
          Bracelet_Length: Bracelet_Length ?? null,
          Secondary_Gemstone: Secondary_Gemstone ?? null,
          Earring_Fastening_Types: Earring_Fastening_Types ?? null,
          Bracelet_Clasp_Types: Bracelet_Clasp_Types ?? null,
          Ring_Band_Style: Ring_Band_Style ?? null,
          Ring_Setting: Ring_Setting ?? null,
          Necklace_Chain_Style: Necklace_Chain_Style ?? null,
          Bracelet_Chain_Style: Bracelet_Chain_Style ?? null,
          Brooch_Fastening_Types: Brooch_Fastening_Types ?? null,
          Gem_Settings: Gem_Settings ?? null,
          Necklace_Clasp: Necklace_Clasp ?? null,
          clientID,
        };
        const validationResponses = await Promise.all(
          Object.keys(validations).reduce((promises, fieldName) => {
            if (Array.isArray(modelFields[fieldName])) {
              promises.push(
                ...modelFields[fieldName].map((item) =>
                  runValidationTasks(fieldName, item)
                )
              );
              return promises;
            }
            promises.push(
              runValidationTasks(fieldName, modelFields[fieldName])
            );
            return promises;
          }, [])
        );
        if (validationResponses.some((r) => r.hasError)) {
          return;
        }
        if (onSubmit) {
          modelFields = onSubmit(modelFields);
        }
        try {
          Object.entries(modelFields).forEach(([key, value]) => {
            if (typeof value === "string" && value === "") {
              modelFields[key] = null;
            }
          });
          await client.graphql({
            query: updateCreations.replaceAll("__typename", ""),
            variables: {
              input: {
                id: creationsRecord.id,
                ...modelFields,
              },
            },
          });
          if (onSuccess) {
            onSuccess(modelFields);
          }
        } catch (err) {
          if (onError) {
            const messages = err.errors.map((e) => e.message).join("\n");
            onError(modelFields, messages);
          }
        }
      }}
      {...getOverrideProps(overrides, "CreationsUpdateForm")}
      {...rest}
    >
      <TextField
        label="Prompt"
        isRequired={false}
        isReadOnly={false}
        value={prompt}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              prompt: value,
              costprompt,
              gender,
              jewellrytype,
              material,
              kwt,
              stone,
              grade,
              Gemsource,
              ringsize,
              Style,
              ringstyle,
              gemsize,
              cut,
              url,
              colour,
              shape,
              accepteddate,
              ipaddress,
              outstandingbalance,
              requiredby,
              Estimatecostfrom,
              Estimatecostto,
              lastupdate,
              status,
              submittedforquote,
              submittedfororder,
              termsaccepted,
              amontquoted,
              submitteddate,
              clarity,
              bandwidth,
              Prompt_Strength,
              Similarity_Strength,
              seedurl,
              Necklace_Length,
              Bracelet_Length,
              Secondary_Gemstone,
              Earring_Fastening_Types,
              Bracelet_Clasp_Types,
              Ring_Band_Style,
              Ring_Setting,
              Necklace_Chain_Style,
              Bracelet_Chain_Style,
              Brooch_Fastening_Types,
              Gem_Settings,
              Necklace_Clasp,
              clientID,
            };
            const result = onChange(modelFields);
            value = result?.prompt ?? value;
          }
          if (errors.prompt?.hasError) {
            runValidationTasks("prompt", value);
          }
          setPrompt(value);
        }}
        onBlur={() => runValidationTasks("prompt", prompt)}
        errorMessage={errors.prompt?.errorMessage}
        hasError={errors.prompt?.hasError}
        {...getOverrideProps(overrides, "prompt")}
      ></TextField>
      <TextField
        label="Costprompt"
        isRequired={false}
        isReadOnly={false}
        value={costprompt}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              prompt,
              costprompt: value,
              gender,
              jewellrytype,
              material,
              kwt,
              stone,
              grade,
              Gemsource,
              ringsize,
              Style,
              ringstyle,
              gemsize,
              cut,
              url,
              colour,
              shape,
              accepteddate,
              ipaddress,
              outstandingbalance,
              requiredby,
              Estimatecostfrom,
              Estimatecostto,
              lastupdate,
              status,
              submittedforquote,
              submittedfororder,
              termsaccepted,
              amontquoted,
              submitteddate,
              clarity,
              bandwidth,
              Prompt_Strength,
              Similarity_Strength,
              seedurl,
              Necklace_Length,
              Bracelet_Length,
              Secondary_Gemstone,
              Earring_Fastening_Types,
              Bracelet_Clasp_Types,
              Ring_Band_Style,
              Ring_Setting,
              Necklace_Chain_Style,
              Bracelet_Chain_Style,
              Brooch_Fastening_Types,
              Gem_Settings,
              Necklace_Clasp,
              clientID,
            };
            const result = onChange(modelFields);
            value = result?.costprompt ?? value;
          }
          if (errors.costprompt?.hasError) {
            runValidationTasks("costprompt", value);
          }
          setCostprompt(value);
        }}
        onBlur={() => runValidationTasks("costprompt", costprompt)}
        errorMessage={errors.costprompt?.errorMessage}
        hasError={errors.costprompt?.hasError}
        {...getOverrideProps(overrides, "costprompt")}
      ></TextField>
      <TextField
        label="Gender"
        isRequired={false}
        isReadOnly={false}
        value={gender}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              prompt,
              costprompt,
              gender: value,
              jewellrytype,
              material,
              kwt,
              stone,
              grade,
              Gemsource,
              ringsize,
              Style,
              ringstyle,
              gemsize,
              cut,
              url,
              colour,
              shape,
              accepteddate,
              ipaddress,
              outstandingbalance,
              requiredby,
              Estimatecostfrom,
              Estimatecostto,
              lastupdate,
              status,
              submittedforquote,
              submittedfororder,
              termsaccepted,
              amontquoted,
              submitteddate,
              clarity,
              bandwidth,
              Prompt_Strength,
              Similarity_Strength,
              seedurl,
              Necklace_Length,
              Bracelet_Length,
              Secondary_Gemstone,
              Earring_Fastening_Types,
              Bracelet_Clasp_Types,
              Ring_Band_Style,
              Ring_Setting,
              Necklace_Chain_Style,
              Bracelet_Chain_Style,
              Brooch_Fastening_Types,
              Gem_Settings,
              Necklace_Clasp,
              clientID,
            };
            const result = onChange(modelFields);
            value = result?.gender ?? value;
          }
          if (errors.gender?.hasError) {
            runValidationTasks("gender", value);
          }
          setGender(value);
        }}
        onBlur={() => runValidationTasks("gender", gender)}
        errorMessage={errors.gender?.errorMessage}
        hasError={errors.gender?.hasError}
        {...getOverrideProps(overrides, "gender")}
      ></TextField>
      <TextField
        label="Jewellrytype"
        isRequired={false}
        isReadOnly={false}
        value={jewellrytype}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              prompt,
              costprompt,
              gender,
              jewellrytype: value,
              material,
              kwt,
              stone,
              grade,
              Gemsource,
              ringsize,
              Style,
              ringstyle,
              gemsize,
              cut,
              url,
              colour,
              shape,
              accepteddate,
              ipaddress,
              outstandingbalance,
              requiredby,
              Estimatecostfrom,
              Estimatecostto,
              lastupdate,
              status,
              submittedforquote,
              submittedfororder,
              termsaccepted,
              amontquoted,
              submitteddate,
              clarity,
              bandwidth,
              Prompt_Strength,
              Similarity_Strength,
              seedurl,
              Necklace_Length,
              Bracelet_Length,
              Secondary_Gemstone,
              Earring_Fastening_Types,
              Bracelet_Clasp_Types,
              Ring_Band_Style,
              Ring_Setting,
              Necklace_Chain_Style,
              Bracelet_Chain_Style,
              Brooch_Fastening_Types,
              Gem_Settings,
              Necklace_Clasp,
              clientID,
            };
            const result = onChange(modelFields);
            value = result?.jewellrytype ?? value;
          }
          if (errors.jewellrytype?.hasError) {
            runValidationTasks("jewellrytype", value);
          }
          setJewellrytype(value);
        }}
        onBlur={() => runValidationTasks("jewellrytype", jewellrytype)}
        errorMessage={errors.jewellrytype?.errorMessage}
        hasError={errors.jewellrytype?.hasError}
        {...getOverrideProps(overrides, "jewellrytype")}
      ></TextField>
      <TextField
        label="Material"
        isRequired={false}
        isReadOnly={false}
        value={material}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              prompt,
              costprompt,
              gender,
              jewellrytype,
              material: value,
              kwt,
              stone,
              grade,
              Gemsource,
              ringsize,
              Style,
              ringstyle,
              gemsize,
              cut,
              url,
              colour,
              shape,
              accepteddate,
              ipaddress,
              outstandingbalance,
              requiredby,
              Estimatecostfrom,
              Estimatecostto,
              lastupdate,
              status,
              submittedforquote,
              submittedfororder,
              termsaccepted,
              amontquoted,
              submitteddate,
              clarity,
              bandwidth,
              Prompt_Strength,
              Similarity_Strength,
              seedurl,
              Necklace_Length,
              Bracelet_Length,
              Secondary_Gemstone,
              Earring_Fastening_Types,
              Bracelet_Clasp_Types,
              Ring_Band_Style,
              Ring_Setting,
              Necklace_Chain_Style,
              Bracelet_Chain_Style,
              Brooch_Fastening_Types,
              Gem_Settings,
              Necklace_Clasp,
              clientID,
            };
            const result = onChange(modelFields);
            value = result?.material ?? value;
          }
          if (errors.material?.hasError) {
            runValidationTasks("material", value);
          }
          setMaterial(value);
        }}
        onBlur={() => runValidationTasks("material", material)}
        errorMessage={errors.material?.errorMessage}
        hasError={errors.material?.hasError}
        {...getOverrideProps(overrides, "material")}
      ></TextField>
      <TextField
        label="Kwt"
        isRequired={false}
        isReadOnly={false}
        value={kwt}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              prompt,
              costprompt,
              gender,
              jewellrytype,
              material,
              kwt: value,
              stone,
              grade,
              Gemsource,
              ringsize,
              Style,
              ringstyle,
              gemsize,
              cut,
              url,
              colour,
              shape,
              accepteddate,
              ipaddress,
              outstandingbalance,
              requiredby,
              Estimatecostfrom,
              Estimatecostto,
              lastupdate,
              status,
              submittedforquote,
              submittedfororder,
              termsaccepted,
              amontquoted,
              submitteddate,
              clarity,
              bandwidth,
              Prompt_Strength,
              Similarity_Strength,
              seedurl,
              Necklace_Length,
              Bracelet_Length,
              Secondary_Gemstone,
              Earring_Fastening_Types,
              Bracelet_Clasp_Types,
              Ring_Band_Style,
              Ring_Setting,
              Necklace_Chain_Style,
              Bracelet_Chain_Style,
              Brooch_Fastening_Types,
              Gem_Settings,
              Necklace_Clasp,
              clientID,
            };
            const result = onChange(modelFields);
            value = result?.kwt ?? value;
          }
          if (errors.kwt?.hasError) {
            runValidationTasks("kwt", value);
          }
          setKwt(value);
        }}
        onBlur={() => runValidationTasks("kwt", kwt)}
        errorMessage={errors.kwt?.errorMessage}
        hasError={errors.kwt?.hasError}
        {...getOverrideProps(overrides, "kwt")}
      ></TextField>
      <TextField
        label="Stone"
        isRequired={false}
        isReadOnly={false}
        value={stone}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              prompt,
              costprompt,
              gender,
              jewellrytype,
              material,
              kwt,
              stone: value,
              grade,
              Gemsource,
              ringsize,
              Style,
              ringstyle,
              gemsize,
              cut,
              url,
              colour,
              shape,
              accepteddate,
              ipaddress,
              outstandingbalance,
              requiredby,
              Estimatecostfrom,
              Estimatecostto,
              lastupdate,
              status,
              submittedforquote,
              submittedfororder,
              termsaccepted,
              amontquoted,
              submitteddate,
              clarity,
              bandwidth,
              Prompt_Strength,
              Similarity_Strength,
              seedurl,
              Necklace_Length,
              Bracelet_Length,
              Secondary_Gemstone,
              Earring_Fastening_Types,
              Bracelet_Clasp_Types,
              Ring_Band_Style,
              Ring_Setting,
              Necklace_Chain_Style,
              Bracelet_Chain_Style,
              Brooch_Fastening_Types,
              Gem_Settings,
              Necklace_Clasp,
              clientID,
            };
            const result = onChange(modelFields);
            value = result?.stone ?? value;
          }
          if (errors.stone?.hasError) {
            runValidationTasks("stone", value);
          }
          setStone(value);
        }}
        onBlur={() => runValidationTasks("stone", stone)}
        errorMessage={errors.stone?.errorMessage}
        hasError={errors.stone?.hasError}
        {...getOverrideProps(overrides, "stone")}
      ></TextField>
      <TextField
        label="Grade"
        isRequired={false}
        isReadOnly={false}
        value={grade}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              prompt,
              costprompt,
              gender,
              jewellrytype,
              material,
              kwt,
              stone,
              grade: value,
              Gemsource,
              ringsize,
              Style,
              ringstyle,
              gemsize,
              cut,
              url,
              colour,
              shape,
              accepteddate,
              ipaddress,
              outstandingbalance,
              requiredby,
              Estimatecostfrom,
              Estimatecostto,
              lastupdate,
              status,
              submittedforquote,
              submittedfororder,
              termsaccepted,
              amontquoted,
              submitteddate,
              clarity,
              bandwidth,
              Prompt_Strength,
              Similarity_Strength,
              seedurl,
              Necklace_Length,
              Bracelet_Length,
              Secondary_Gemstone,
              Earring_Fastening_Types,
              Bracelet_Clasp_Types,
              Ring_Band_Style,
              Ring_Setting,
              Necklace_Chain_Style,
              Bracelet_Chain_Style,
              Brooch_Fastening_Types,
              Gem_Settings,
              Necklace_Clasp,
              clientID,
            };
            const result = onChange(modelFields);
            value = result?.grade ?? value;
          }
          if (errors.grade?.hasError) {
            runValidationTasks("grade", value);
          }
          setGrade(value);
        }}
        onBlur={() => runValidationTasks("grade", grade)}
        errorMessage={errors.grade?.errorMessage}
        hasError={errors.grade?.hasError}
        {...getOverrideProps(overrides, "grade")}
      ></TextField>
      <TextField
        label="Gemsource"
        isRequired={false}
        isReadOnly={false}
        value={Gemsource}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              prompt,
              costprompt,
              gender,
              jewellrytype,
              material,
              kwt,
              stone,
              grade,
              Gemsource: value,
              ringsize,
              Style,
              ringstyle,
              gemsize,
              cut,
              url,
              colour,
              shape,
              accepteddate,
              ipaddress,
              outstandingbalance,
              requiredby,
              Estimatecostfrom,
              Estimatecostto,
              lastupdate,
              status,
              submittedforquote,
              submittedfororder,
              termsaccepted,
              amontquoted,
              submitteddate,
              clarity,
              bandwidth,
              Prompt_Strength,
              Similarity_Strength,
              seedurl,
              Necklace_Length,
              Bracelet_Length,
              Secondary_Gemstone,
              Earring_Fastening_Types,
              Bracelet_Clasp_Types,
              Ring_Band_Style,
              Ring_Setting,
              Necklace_Chain_Style,
              Bracelet_Chain_Style,
              Brooch_Fastening_Types,
              Gem_Settings,
              Necklace_Clasp,
              clientID,
            };
            const result = onChange(modelFields);
            value = result?.Gemsource ?? value;
          }
          if (errors.Gemsource?.hasError) {
            runValidationTasks("Gemsource", value);
          }
          setGemsource(value);
        }}
        onBlur={() => runValidationTasks("Gemsource", Gemsource)}
        errorMessage={errors.Gemsource?.errorMessage}
        hasError={errors.Gemsource?.hasError}
        {...getOverrideProps(overrides, "Gemsource")}
      ></TextField>
      <TextField
        label="Ringsize"
        isRequired={false}
        isReadOnly={false}
        value={ringsize}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              prompt,
              costprompt,
              gender,
              jewellrytype,
              material,
              kwt,
              stone,
              grade,
              Gemsource,
              ringsize: value,
              Style,
              ringstyle,
              gemsize,
              cut,
              url,
              colour,
              shape,
              accepteddate,
              ipaddress,
              outstandingbalance,
              requiredby,
              Estimatecostfrom,
              Estimatecostto,
              lastupdate,
              status,
              submittedforquote,
              submittedfororder,
              termsaccepted,
              amontquoted,
              submitteddate,
              clarity,
              bandwidth,
              Prompt_Strength,
              Similarity_Strength,
              seedurl,
              Necklace_Length,
              Bracelet_Length,
              Secondary_Gemstone,
              Earring_Fastening_Types,
              Bracelet_Clasp_Types,
              Ring_Band_Style,
              Ring_Setting,
              Necklace_Chain_Style,
              Bracelet_Chain_Style,
              Brooch_Fastening_Types,
              Gem_Settings,
              Necklace_Clasp,
              clientID,
            };
            const result = onChange(modelFields);
            value = result?.ringsize ?? value;
          }
          if (errors.ringsize?.hasError) {
            runValidationTasks("ringsize", value);
          }
          setRingsize(value);
        }}
        onBlur={() => runValidationTasks("ringsize", ringsize)}
        errorMessage={errors.ringsize?.errorMessage}
        hasError={errors.ringsize?.hasError}
        {...getOverrideProps(overrides, "ringsize")}
      ></TextField>
      <TextField
        label="Style"
        isRequired={false}
        isReadOnly={false}
        value={Style}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              prompt,
              costprompt,
              gender,
              jewellrytype,
              material,
              kwt,
              stone,
              grade,
              Gemsource,
              ringsize,
              Style: value,
              ringstyle,
              gemsize,
              cut,
              url,
              colour,
              shape,
              accepteddate,
              ipaddress,
              outstandingbalance,
              requiredby,
              Estimatecostfrom,
              Estimatecostto,
              lastupdate,
              status,
              submittedforquote,
              submittedfororder,
              termsaccepted,
              amontquoted,
              submitteddate,
              clarity,
              bandwidth,
              Prompt_Strength,
              Similarity_Strength,
              seedurl,
              Necklace_Length,
              Bracelet_Length,
              Secondary_Gemstone,
              Earring_Fastening_Types,
              Bracelet_Clasp_Types,
              Ring_Band_Style,
              Ring_Setting,
              Necklace_Chain_Style,
              Bracelet_Chain_Style,
              Brooch_Fastening_Types,
              Gem_Settings,
              Necklace_Clasp,
              clientID,
            };
            const result = onChange(modelFields);
            value = result?.Style ?? value;
          }
          if (errors.Style?.hasError) {
            runValidationTasks("Style", value);
          }
          setStyle(value);
        }}
        onBlur={() => runValidationTasks("Style", Style)}
        errorMessage={errors.Style?.errorMessage}
        hasError={errors.Style?.hasError}
        {...getOverrideProps(overrides, "Style")}
      ></TextField>
      <TextField
        label="Ringstyle"
        isRequired={false}
        isReadOnly={false}
        value={ringstyle}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              prompt,
              costprompt,
              gender,
              jewellrytype,
              material,
              kwt,
              stone,
              grade,
              Gemsource,
              ringsize,
              Style,
              ringstyle: value,
              gemsize,
              cut,
              url,
              colour,
              shape,
              accepteddate,
              ipaddress,
              outstandingbalance,
              requiredby,
              Estimatecostfrom,
              Estimatecostto,
              lastupdate,
              status,
              submittedforquote,
              submittedfororder,
              termsaccepted,
              amontquoted,
              submitteddate,
              clarity,
              bandwidth,
              Prompt_Strength,
              Similarity_Strength,
              seedurl,
              Necklace_Length,
              Bracelet_Length,
              Secondary_Gemstone,
              Earring_Fastening_Types,
              Bracelet_Clasp_Types,
              Ring_Band_Style,
              Ring_Setting,
              Necklace_Chain_Style,
              Bracelet_Chain_Style,
              Brooch_Fastening_Types,
              Gem_Settings,
              Necklace_Clasp,
              clientID,
            };
            const result = onChange(modelFields);
            value = result?.ringstyle ?? value;
          }
          if (errors.ringstyle?.hasError) {
            runValidationTasks("ringstyle", value);
          }
          setRingstyle(value);
        }}
        onBlur={() => runValidationTasks("ringstyle", ringstyle)}
        errorMessage={errors.ringstyle?.errorMessage}
        hasError={errors.ringstyle?.hasError}
        {...getOverrideProps(overrides, "ringstyle")}
      ></TextField>
      <TextField
        label="Gemsize"
        isRequired={false}
        isReadOnly={false}
        value={gemsize}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              prompt,
              costprompt,
              gender,
              jewellrytype,
              material,
              kwt,
              stone,
              grade,
              Gemsource,
              ringsize,
              Style,
              ringstyle,
              gemsize: value,
              cut,
              url,
              colour,
              shape,
              accepteddate,
              ipaddress,
              outstandingbalance,
              requiredby,
              Estimatecostfrom,
              Estimatecostto,
              lastupdate,
              status,
              submittedforquote,
              submittedfororder,
              termsaccepted,
              amontquoted,
              submitteddate,
              clarity,
              bandwidth,
              Prompt_Strength,
              Similarity_Strength,
              seedurl,
              Necklace_Length,
              Bracelet_Length,
              Secondary_Gemstone,
              Earring_Fastening_Types,
              Bracelet_Clasp_Types,
              Ring_Band_Style,
              Ring_Setting,
              Necklace_Chain_Style,
              Bracelet_Chain_Style,
              Brooch_Fastening_Types,
              Gem_Settings,
              Necklace_Clasp,
              clientID,
            };
            const result = onChange(modelFields);
            value = result?.gemsize ?? value;
          }
          if (errors.gemsize?.hasError) {
            runValidationTasks("gemsize", value);
          }
          setGemsize(value);
        }}
        onBlur={() => runValidationTasks("gemsize", gemsize)}
        errorMessage={errors.gemsize?.errorMessage}
        hasError={errors.gemsize?.hasError}
        {...getOverrideProps(overrides, "gemsize")}
      ></TextField>
      <TextField
        label="Cut"
        isRequired={false}
        isReadOnly={false}
        value={cut}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              prompt,
              costprompt,
              gender,
              jewellrytype,
              material,
              kwt,
              stone,
              grade,
              Gemsource,
              ringsize,
              Style,
              ringstyle,
              gemsize,
              cut: value,
              url,
              colour,
              shape,
              accepteddate,
              ipaddress,
              outstandingbalance,
              requiredby,
              Estimatecostfrom,
              Estimatecostto,
              lastupdate,
              status,
              submittedforquote,
              submittedfororder,
              termsaccepted,
              amontquoted,
              submitteddate,
              clarity,
              bandwidth,
              Prompt_Strength,
              Similarity_Strength,
              seedurl,
              Necklace_Length,
              Bracelet_Length,
              Secondary_Gemstone,
              Earring_Fastening_Types,
              Bracelet_Clasp_Types,
              Ring_Band_Style,
              Ring_Setting,
              Necklace_Chain_Style,
              Bracelet_Chain_Style,
              Brooch_Fastening_Types,
              Gem_Settings,
              Necklace_Clasp,
              clientID,
            };
            const result = onChange(modelFields);
            value = result?.cut ?? value;
          }
          if (errors.cut?.hasError) {
            runValidationTasks("cut", value);
          }
          setCut(value);
        }}
        onBlur={() => runValidationTasks("cut", cut)}
        errorMessage={errors.cut?.errorMessage}
        hasError={errors.cut?.hasError}
        {...getOverrideProps(overrides, "cut")}
      ></TextField>
      <TextField
        label="Url"
        isRequired={false}
        isReadOnly={false}
        value={url}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              prompt,
              costprompt,
              gender,
              jewellrytype,
              material,
              kwt,
              stone,
              grade,
              Gemsource,
              ringsize,
              Style,
              ringstyle,
              gemsize,
              cut,
              url: value,
              colour,
              shape,
              accepteddate,
              ipaddress,
              outstandingbalance,
              requiredby,
              Estimatecostfrom,
              Estimatecostto,
              lastupdate,
              status,
              submittedforquote,
              submittedfororder,
              termsaccepted,
              amontquoted,
              submitteddate,
              clarity,
              bandwidth,
              Prompt_Strength,
              Similarity_Strength,
              seedurl,
              Necklace_Length,
              Bracelet_Length,
              Secondary_Gemstone,
              Earring_Fastening_Types,
              Bracelet_Clasp_Types,
              Ring_Band_Style,
              Ring_Setting,
              Necklace_Chain_Style,
              Bracelet_Chain_Style,
              Brooch_Fastening_Types,
              Gem_Settings,
              Necklace_Clasp,
              clientID,
            };
            const result = onChange(modelFields);
            value = result?.url ?? value;
          }
          if (errors.url?.hasError) {
            runValidationTasks("url", value);
          }
          setUrl(value);
        }}
        onBlur={() => runValidationTasks("url", url)}
        errorMessage={errors.url?.errorMessage}
        hasError={errors.url?.hasError}
        {...getOverrideProps(overrides, "url")}
      ></TextField>
      <TextField
        label="Colour"
        isRequired={false}
        isReadOnly={false}
        value={colour}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              prompt,
              costprompt,
              gender,
              jewellrytype,
              material,
              kwt,
              stone,
              grade,
              Gemsource,
              ringsize,
              Style,
              ringstyle,
              gemsize,
              cut,
              url,
              colour: value,
              shape,
              accepteddate,
              ipaddress,
              outstandingbalance,
              requiredby,
              Estimatecostfrom,
              Estimatecostto,
              lastupdate,
              status,
              submittedforquote,
              submittedfororder,
              termsaccepted,
              amontquoted,
              submitteddate,
              clarity,
              bandwidth,
              Prompt_Strength,
              Similarity_Strength,
              seedurl,
              Necklace_Length,
              Bracelet_Length,
              Secondary_Gemstone,
              Earring_Fastening_Types,
              Bracelet_Clasp_Types,
              Ring_Band_Style,
              Ring_Setting,
              Necklace_Chain_Style,
              Bracelet_Chain_Style,
              Brooch_Fastening_Types,
              Gem_Settings,
              Necklace_Clasp,
              clientID,
            };
            const result = onChange(modelFields);
            value = result?.colour ?? value;
          }
          if (errors.colour?.hasError) {
            runValidationTasks("colour", value);
          }
          setColour(value);
        }}
        onBlur={() => runValidationTasks("colour", colour)}
        errorMessage={errors.colour?.errorMessage}
        hasError={errors.colour?.hasError}
        {...getOverrideProps(overrides, "colour")}
      ></TextField>
      <TextField
        label="Shape"
        isRequired={false}
        isReadOnly={false}
        value={shape}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              prompt,
              costprompt,
              gender,
              jewellrytype,
              material,
              kwt,
              stone,
              grade,
              Gemsource,
              ringsize,
              Style,
              ringstyle,
              gemsize,
              cut,
              url,
              colour,
              shape: value,
              accepteddate,
              ipaddress,
              outstandingbalance,
              requiredby,
              Estimatecostfrom,
              Estimatecostto,
              lastupdate,
              status,
              submittedforquote,
              submittedfororder,
              termsaccepted,
              amontquoted,
              submitteddate,
              clarity,
              bandwidth,
              Prompt_Strength,
              Similarity_Strength,
              seedurl,
              Necklace_Length,
              Bracelet_Length,
              Secondary_Gemstone,
              Earring_Fastening_Types,
              Bracelet_Clasp_Types,
              Ring_Band_Style,
              Ring_Setting,
              Necklace_Chain_Style,
              Bracelet_Chain_Style,
              Brooch_Fastening_Types,
              Gem_Settings,
              Necklace_Clasp,
              clientID,
            };
            const result = onChange(modelFields);
            value = result?.shape ?? value;
          }
          if (errors.shape?.hasError) {
            runValidationTasks("shape", value);
          }
          setShape(value);
        }}
        onBlur={() => runValidationTasks("shape", shape)}
        errorMessage={errors.shape?.errorMessage}
        hasError={errors.shape?.hasError}
        {...getOverrideProps(overrides, "shape")}
      ></TextField>
      <TextField
        label="Accepteddate"
        isRequired={false}
        isReadOnly={false}
        type="date"
        value={accepteddate}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              prompt,
              costprompt,
              gender,
              jewellrytype,
              material,
              kwt,
              stone,
              grade,
              Gemsource,
              ringsize,
              Style,
              ringstyle,
              gemsize,
              cut,
              url,
              colour,
              shape,
              accepteddate: value,
              ipaddress,
              outstandingbalance,
              requiredby,
              Estimatecostfrom,
              Estimatecostto,
              lastupdate,
              status,
              submittedforquote,
              submittedfororder,
              termsaccepted,
              amontquoted,
              submitteddate,
              clarity,
              bandwidth,
              Prompt_Strength,
              Similarity_Strength,
              seedurl,
              Necklace_Length,
              Bracelet_Length,
              Secondary_Gemstone,
              Earring_Fastening_Types,
              Bracelet_Clasp_Types,
              Ring_Band_Style,
              Ring_Setting,
              Necklace_Chain_Style,
              Bracelet_Chain_Style,
              Brooch_Fastening_Types,
              Gem_Settings,
              Necklace_Clasp,
              clientID,
            };
            const result = onChange(modelFields);
            value = result?.accepteddate ?? value;
          }
          if (errors.accepteddate?.hasError) {
            runValidationTasks("accepteddate", value);
          }
          setAccepteddate(value);
        }}
        onBlur={() => runValidationTasks("accepteddate", accepteddate)}
        errorMessage={errors.accepteddate?.errorMessage}
        hasError={errors.accepteddate?.hasError}
        {...getOverrideProps(overrides, "accepteddate")}
      ></TextField>
      <TextField
        label="Ipaddress"
        isRequired={false}
        isReadOnly={false}
        value={ipaddress}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              prompt,
              costprompt,
              gender,
              jewellrytype,
              material,
              kwt,
              stone,
              grade,
              Gemsource,
              ringsize,
              Style,
              ringstyle,
              gemsize,
              cut,
              url,
              colour,
              shape,
              accepteddate,
              ipaddress: value,
              outstandingbalance,
              requiredby,
              Estimatecostfrom,
              Estimatecostto,
              lastupdate,
              status,
              submittedforquote,
              submittedfororder,
              termsaccepted,
              amontquoted,
              submitteddate,
              clarity,
              bandwidth,
              Prompt_Strength,
              Similarity_Strength,
              seedurl,
              Necklace_Length,
              Bracelet_Length,
              Secondary_Gemstone,
              Earring_Fastening_Types,
              Bracelet_Clasp_Types,
              Ring_Band_Style,
              Ring_Setting,
              Necklace_Chain_Style,
              Bracelet_Chain_Style,
              Brooch_Fastening_Types,
              Gem_Settings,
              Necklace_Clasp,
              clientID,
            };
            const result = onChange(modelFields);
            value = result?.ipaddress ?? value;
          }
          if (errors.ipaddress?.hasError) {
            runValidationTasks("ipaddress", value);
          }
          setIpaddress(value);
        }}
        onBlur={() => runValidationTasks("ipaddress", ipaddress)}
        errorMessage={errors.ipaddress?.errorMessage}
        hasError={errors.ipaddress?.hasError}
        {...getOverrideProps(overrides, "ipaddress")}
      ></TextField>
      <TextField
        label="Outstandingbalance"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={outstandingbalance}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              prompt,
              costprompt,
              gender,
              jewellrytype,
              material,
              kwt,
              stone,
              grade,
              Gemsource,
              ringsize,
              Style,
              ringstyle,
              gemsize,
              cut,
              url,
              colour,
              shape,
              accepteddate,
              ipaddress,
              outstandingbalance: value,
              requiredby,
              Estimatecostfrom,
              Estimatecostto,
              lastupdate,
              status,
              submittedforquote,
              submittedfororder,
              termsaccepted,
              amontquoted,
              submitteddate,
              clarity,
              bandwidth,
              Prompt_Strength,
              Similarity_Strength,
              seedurl,
              Necklace_Length,
              Bracelet_Length,
              Secondary_Gemstone,
              Earring_Fastening_Types,
              Bracelet_Clasp_Types,
              Ring_Band_Style,
              Ring_Setting,
              Necklace_Chain_Style,
              Bracelet_Chain_Style,
              Brooch_Fastening_Types,
              Gem_Settings,
              Necklace_Clasp,
              clientID,
            };
            const result = onChange(modelFields);
            value = result?.outstandingbalance ?? value;
          }
          if (errors.outstandingbalance?.hasError) {
            runValidationTasks("outstandingbalance", value);
          }
          setOutstandingbalance(value);
        }}
        onBlur={() =>
          runValidationTasks("outstandingbalance", outstandingbalance)
        }
        errorMessage={errors.outstandingbalance?.errorMessage}
        hasError={errors.outstandingbalance?.hasError}
        {...getOverrideProps(overrides, "outstandingbalance")}
      ></TextField>
      <TextField
        label="Requiredby"
        isRequired={false}
        isReadOnly={false}
        type="date"
        value={requiredby}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              prompt,
              costprompt,
              gender,
              jewellrytype,
              material,
              kwt,
              stone,
              grade,
              Gemsource,
              ringsize,
              Style,
              ringstyle,
              gemsize,
              cut,
              url,
              colour,
              shape,
              accepteddate,
              ipaddress,
              outstandingbalance,
              requiredby: value,
              Estimatecostfrom,
              Estimatecostto,
              lastupdate,
              status,
              submittedforquote,
              submittedfororder,
              termsaccepted,
              amontquoted,
              submitteddate,
              clarity,
              bandwidth,
              Prompt_Strength,
              Similarity_Strength,
              seedurl,
              Necklace_Length,
              Bracelet_Length,
              Secondary_Gemstone,
              Earring_Fastening_Types,
              Bracelet_Clasp_Types,
              Ring_Band_Style,
              Ring_Setting,
              Necklace_Chain_Style,
              Bracelet_Chain_Style,
              Brooch_Fastening_Types,
              Gem_Settings,
              Necklace_Clasp,
              clientID,
            };
            const result = onChange(modelFields);
            value = result?.requiredby ?? value;
          }
          if (errors.requiredby?.hasError) {
            runValidationTasks("requiredby", value);
          }
          setRequiredby(value);
        }}
        onBlur={() => runValidationTasks("requiredby", requiredby)}
        errorMessage={errors.requiredby?.errorMessage}
        hasError={errors.requiredby?.hasError}
        {...getOverrideProps(overrides, "requiredby")}
      ></TextField>
      <TextField
        label="Estimatecostfrom"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={Estimatecostfrom}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              prompt,
              costprompt,
              gender,
              jewellrytype,
              material,
              kwt,
              stone,
              grade,
              Gemsource,
              ringsize,
              Style,
              ringstyle,
              gemsize,
              cut,
              url,
              colour,
              shape,
              accepteddate,
              ipaddress,
              outstandingbalance,
              requiredby,
              Estimatecostfrom: value,
              Estimatecostto,
              lastupdate,
              status,
              submittedforquote,
              submittedfororder,
              termsaccepted,
              amontquoted,
              submitteddate,
              clarity,
              bandwidth,
              Prompt_Strength,
              Similarity_Strength,
              seedurl,
              Necklace_Length,
              Bracelet_Length,
              Secondary_Gemstone,
              Earring_Fastening_Types,
              Bracelet_Clasp_Types,
              Ring_Band_Style,
              Ring_Setting,
              Necklace_Chain_Style,
              Bracelet_Chain_Style,
              Brooch_Fastening_Types,
              Gem_Settings,
              Necklace_Clasp,
              clientID,
            };
            const result = onChange(modelFields);
            value = result?.Estimatecostfrom ?? value;
          }
          if (errors.Estimatecostfrom?.hasError) {
            runValidationTasks("Estimatecostfrom", value);
          }
          setEstimatecostfrom(value);
        }}
        onBlur={() => runValidationTasks("Estimatecostfrom", Estimatecostfrom)}
        errorMessage={errors.Estimatecostfrom?.errorMessage}
        hasError={errors.Estimatecostfrom?.hasError}
        {...getOverrideProps(overrides, "Estimatecostfrom")}
      ></TextField>
      <TextField
        label="Estimatecostto"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={Estimatecostto}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              prompt,
              costprompt,
              gender,
              jewellrytype,
              material,
              kwt,
              stone,
              grade,
              Gemsource,
              ringsize,
              Style,
              ringstyle,
              gemsize,
              cut,
              url,
              colour,
              shape,
              accepteddate,
              ipaddress,
              outstandingbalance,
              requiredby,
              Estimatecostfrom,
              Estimatecostto: value,
              lastupdate,
              status,
              submittedforquote,
              submittedfororder,
              termsaccepted,
              amontquoted,
              submitteddate,
              clarity,
              bandwidth,
              Prompt_Strength,
              Similarity_Strength,
              seedurl,
              Necklace_Length,
              Bracelet_Length,
              Secondary_Gemstone,
              Earring_Fastening_Types,
              Bracelet_Clasp_Types,
              Ring_Band_Style,
              Ring_Setting,
              Necklace_Chain_Style,
              Bracelet_Chain_Style,
              Brooch_Fastening_Types,
              Gem_Settings,
              Necklace_Clasp,
              clientID,
            };
            const result = onChange(modelFields);
            value = result?.Estimatecostto ?? value;
          }
          if (errors.Estimatecostto?.hasError) {
            runValidationTasks("Estimatecostto", value);
          }
          setEstimatecostto(value);
        }}
        onBlur={() => runValidationTasks("Estimatecostto", Estimatecostto)}
        errorMessage={errors.Estimatecostto?.errorMessage}
        hasError={errors.Estimatecostto?.hasError}
        {...getOverrideProps(overrides, "Estimatecostto")}
      ></TextField>
      <TextField
        label="Lastupdate"
        isRequired={false}
        isReadOnly={false}
        type="datetime-local"
        value={lastupdate && convertToLocal(new Date(lastupdate))}
        onChange={(e) => {
          let value =
            e.target.value === "" ? "" : new Date(e.target.value).toISOString();
          if (onChange) {
            const modelFields = {
              prompt,
              costprompt,
              gender,
              jewellrytype,
              material,
              kwt,
              stone,
              grade,
              Gemsource,
              ringsize,
              Style,
              ringstyle,
              gemsize,
              cut,
              url,
              colour,
              shape,
              accepteddate,
              ipaddress,
              outstandingbalance,
              requiredby,
              Estimatecostfrom,
              Estimatecostto,
              lastupdate: value,
              status,
              submittedforquote,
              submittedfororder,
              termsaccepted,
              amontquoted,
              submitteddate,
              clarity,
              bandwidth,
              Prompt_Strength,
              Similarity_Strength,
              seedurl,
              Necklace_Length,
              Bracelet_Length,
              Secondary_Gemstone,
              Earring_Fastening_Types,
              Bracelet_Clasp_Types,
              Ring_Band_Style,
              Ring_Setting,
              Necklace_Chain_Style,
              Bracelet_Chain_Style,
              Brooch_Fastening_Types,
              Gem_Settings,
              Necklace_Clasp,
              clientID,
            };
            const result = onChange(modelFields);
            value = result?.lastupdate ?? value;
          }
          if (errors.lastupdate?.hasError) {
            runValidationTasks("lastupdate", value);
          }
          setLastupdate(value);
        }}
        onBlur={() => runValidationTasks("lastupdate", lastupdate)}
        errorMessage={errors.lastupdate?.errorMessage}
        hasError={errors.lastupdate?.hasError}
        {...getOverrideProps(overrides, "lastupdate")}
      ></TextField>
      <TextField
        label="Status"
        isRequired={false}
        isReadOnly={false}
        value={status}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              prompt,
              costprompt,
              gender,
              jewellrytype,
              material,
              kwt,
              stone,
              grade,
              Gemsource,
              ringsize,
              Style,
              ringstyle,
              gemsize,
              cut,
              url,
              colour,
              shape,
              accepteddate,
              ipaddress,
              outstandingbalance,
              requiredby,
              Estimatecostfrom,
              Estimatecostto,
              lastupdate,
              status: value,
              submittedforquote,
              submittedfororder,
              termsaccepted,
              amontquoted,
              submitteddate,
              clarity,
              bandwidth,
              Prompt_Strength,
              Similarity_Strength,
              seedurl,
              Necklace_Length,
              Bracelet_Length,
              Secondary_Gemstone,
              Earring_Fastening_Types,
              Bracelet_Clasp_Types,
              Ring_Band_Style,
              Ring_Setting,
              Necklace_Chain_Style,
              Bracelet_Chain_Style,
              Brooch_Fastening_Types,
              Gem_Settings,
              Necklace_Clasp,
              clientID,
            };
            const result = onChange(modelFields);
            value = result?.status ?? value;
          }
          if (errors.status?.hasError) {
            runValidationTasks("status", value);
          }
          setStatus(value);
        }}
        onBlur={() => runValidationTasks("status", status)}
        errorMessage={errors.status?.errorMessage}
        hasError={errors.status?.hasError}
        {...getOverrideProps(overrides, "status")}
      ></TextField>
      <SwitchField
        label="Submittedforquote"
        defaultChecked={false}
        isDisabled={false}
        isChecked={submittedforquote}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              prompt,
              costprompt,
              gender,
              jewellrytype,
              material,
              kwt,
              stone,
              grade,
              Gemsource,
              ringsize,
              Style,
              ringstyle,
              gemsize,
              cut,
              url,
              colour,
              shape,
              accepteddate,
              ipaddress,
              outstandingbalance,
              requiredby,
              Estimatecostfrom,
              Estimatecostto,
              lastupdate,
              status,
              submittedforquote: value,
              submittedfororder,
              termsaccepted,
              amontquoted,
              submitteddate,
              clarity,
              bandwidth,
              Prompt_Strength,
              Similarity_Strength,
              seedurl,
              Necklace_Length,
              Bracelet_Length,
              Secondary_Gemstone,
              Earring_Fastening_Types,
              Bracelet_Clasp_Types,
              Ring_Band_Style,
              Ring_Setting,
              Necklace_Chain_Style,
              Bracelet_Chain_Style,
              Brooch_Fastening_Types,
              Gem_Settings,
              Necklace_Clasp,
              clientID,
            };
            const result = onChange(modelFields);
            value = result?.submittedforquote ?? value;
          }
          if (errors.submittedforquote?.hasError) {
            runValidationTasks("submittedforquote", value);
          }
          setSubmittedforquote(value);
        }}
        onBlur={() =>
          runValidationTasks("submittedforquote", submittedforquote)
        }
        errorMessage={errors.submittedforquote?.errorMessage}
        hasError={errors.submittedforquote?.hasError}
        {...getOverrideProps(overrides, "submittedforquote")}
      ></SwitchField>
      <SwitchField
        label="Submittedfororder"
        defaultChecked={false}
        isDisabled={false}
        isChecked={submittedfororder}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              prompt,
              costprompt,
              gender,
              jewellrytype,
              material,
              kwt,
              stone,
              grade,
              Gemsource,
              ringsize,
              Style,
              ringstyle,
              gemsize,
              cut,
              url,
              colour,
              shape,
              accepteddate,
              ipaddress,
              outstandingbalance,
              requiredby,
              Estimatecostfrom,
              Estimatecostto,
              lastupdate,
              status,
              submittedforquote,
              submittedfororder: value,
              termsaccepted,
              amontquoted,
              submitteddate,
              clarity,
              bandwidth,
              Prompt_Strength,
              Similarity_Strength,
              seedurl,
              Necklace_Length,
              Bracelet_Length,
              Secondary_Gemstone,
              Earring_Fastening_Types,
              Bracelet_Clasp_Types,
              Ring_Band_Style,
              Ring_Setting,
              Necklace_Chain_Style,
              Bracelet_Chain_Style,
              Brooch_Fastening_Types,
              Gem_Settings,
              Necklace_Clasp,
              clientID,
            };
            const result = onChange(modelFields);
            value = result?.submittedfororder ?? value;
          }
          if (errors.submittedfororder?.hasError) {
            runValidationTasks("submittedfororder", value);
          }
          setSubmittedfororder(value);
        }}
        onBlur={() =>
          runValidationTasks("submittedfororder", submittedfororder)
        }
        errorMessage={errors.submittedfororder?.errorMessage}
        hasError={errors.submittedfororder?.hasError}
        {...getOverrideProps(overrides, "submittedfororder")}
      ></SwitchField>
      <SwitchField
        label="Termsaccepted"
        defaultChecked={false}
        isDisabled={false}
        isChecked={termsaccepted}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              prompt,
              costprompt,
              gender,
              jewellrytype,
              material,
              kwt,
              stone,
              grade,
              Gemsource,
              ringsize,
              Style,
              ringstyle,
              gemsize,
              cut,
              url,
              colour,
              shape,
              accepteddate,
              ipaddress,
              outstandingbalance,
              requiredby,
              Estimatecostfrom,
              Estimatecostto,
              lastupdate,
              status,
              submittedforquote,
              submittedfororder,
              termsaccepted: value,
              amontquoted,
              submitteddate,
              clarity,
              bandwidth,
              Prompt_Strength,
              Similarity_Strength,
              seedurl,
              Necklace_Length,
              Bracelet_Length,
              Secondary_Gemstone,
              Earring_Fastening_Types,
              Bracelet_Clasp_Types,
              Ring_Band_Style,
              Ring_Setting,
              Necklace_Chain_Style,
              Bracelet_Chain_Style,
              Brooch_Fastening_Types,
              Gem_Settings,
              Necklace_Clasp,
              clientID,
            };
            const result = onChange(modelFields);
            value = result?.termsaccepted ?? value;
          }
          if (errors.termsaccepted?.hasError) {
            runValidationTasks("termsaccepted", value);
          }
          setTermsaccepted(value);
        }}
        onBlur={() => runValidationTasks("termsaccepted", termsaccepted)}
        errorMessage={errors.termsaccepted?.errorMessage}
        hasError={errors.termsaccepted?.hasError}
        {...getOverrideProps(overrides, "termsaccepted")}
      ></SwitchField>
      <TextField
        label="Amontquoted"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={amontquoted}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              prompt,
              costprompt,
              gender,
              jewellrytype,
              material,
              kwt,
              stone,
              grade,
              Gemsource,
              ringsize,
              Style,
              ringstyle,
              gemsize,
              cut,
              url,
              colour,
              shape,
              accepteddate,
              ipaddress,
              outstandingbalance,
              requiredby,
              Estimatecostfrom,
              Estimatecostto,
              lastupdate,
              status,
              submittedforquote,
              submittedfororder,
              termsaccepted,
              amontquoted: value,
              submitteddate,
              clarity,
              bandwidth,
              Prompt_Strength,
              Similarity_Strength,
              seedurl,
              Necklace_Length,
              Bracelet_Length,
              Secondary_Gemstone,
              Earring_Fastening_Types,
              Bracelet_Clasp_Types,
              Ring_Band_Style,
              Ring_Setting,
              Necklace_Chain_Style,
              Bracelet_Chain_Style,
              Brooch_Fastening_Types,
              Gem_Settings,
              Necklace_Clasp,
              clientID,
            };
            const result = onChange(modelFields);
            value = result?.amontquoted ?? value;
          }
          if (errors.amontquoted?.hasError) {
            runValidationTasks("amontquoted", value);
          }
          setAmontquoted(value);
        }}
        onBlur={() => runValidationTasks("amontquoted", amontquoted)}
        errorMessage={errors.amontquoted?.errorMessage}
        hasError={errors.amontquoted?.hasError}
        {...getOverrideProps(overrides, "amontquoted")}
      ></TextField>
      <TextField
        label="Submitteddate"
        isRequired={false}
        isReadOnly={false}
        type="date"
        value={submitteddate}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              prompt,
              costprompt,
              gender,
              jewellrytype,
              material,
              kwt,
              stone,
              grade,
              Gemsource,
              ringsize,
              Style,
              ringstyle,
              gemsize,
              cut,
              url,
              colour,
              shape,
              accepteddate,
              ipaddress,
              outstandingbalance,
              requiredby,
              Estimatecostfrom,
              Estimatecostto,
              lastupdate,
              status,
              submittedforquote,
              submittedfororder,
              termsaccepted,
              amontquoted,
              submitteddate: value,
              clarity,
              bandwidth,
              Prompt_Strength,
              Similarity_Strength,
              seedurl,
              Necklace_Length,
              Bracelet_Length,
              Secondary_Gemstone,
              Earring_Fastening_Types,
              Bracelet_Clasp_Types,
              Ring_Band_Style,
              Ring_Setting,
              Necklace_Chain_Style,
              Bracelet_Chain_Style,
              Brooch_Fastening_Types,
              Gem_Settings,
              Necklace_Clasp,
              clientID,
            };
            const result = onChange(modelFields);
            value = result?.submitteddate ?? value;
          }
          if (errors.submitteddate?.hasError) {
            runValidationTasks("submitteddate", value);
          }
          setSubmitteddate(value);
        }}
        onBlur={() => runValidationTasks("submitteddate", submitteddate)}
        errorMessage={errors.submitteddate?.errorMessage}
        hasError={errors.submitteddate?.hasError}
        {...getOverrideProps(overrides, "submitteddate")}
      ></TextField>
      <TextField
        label="Clarity"
        isRequired={false}
        isReadOnly={false}
        value={clarity}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              prompt,
              costprompt,
              gender,
              jewellrytype,
              material,
              kwt,
              stone,
              grade,
              Gemsource,
              ringsize,
              Style,
              ringstyle,
              gemsize,
              cut,
              url,
              colour,
              shape,
              accepteddate,
              ipaddress,
              outstandingbalance,
              requiredby,
              Estimatecostfrom,
              Estimatecostto,
              lastupdate,
              status,
              submittedforquote,
              submittedfororder,
              termsaccepted,
              amontquoted,
              submitteddate,
              clarity: value,
              bandwidth,
              Prompt_Strength,
              Similarity_Strength,
              seedurl,
              Necklace_Length,
              Bracelet_Length,
              Secondary_Gemstone,
              Earring_Fastening_Types,
              Bracelet_Clasp_Types,
              Ring_Band_Style,
              Ring_Setting,
              Necklace_Chain_Style,
              Bracelet_Chain_Style,
              Brooch_Fastening_Types,
              Gem_Settings,
              Necklace_Clasp,
              clientID,
            };
            const result = onChange(modelFields);
            value = result?.clarity ?? value;
          }
          if (errors.clarity?.hasError) {
            runValidationTasks("clarity", value);
          }
          setClarity(value);
        }}
        onBlur={() => runValidationTasks("clarity", clarity)}
        errorMessage={errors.clarity?.errorMessage}
        hasError={errors.clarity?.hasError}
        {...getOverrideProps(overrides, "clarity")}
      ></TextField>
      <TextField
        label="Bandwidth"
        isRequired={false}
        isReadOnly={false}
        value={bandwidth}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              prompt,
              costprompt,
              gender,
              jewellrytype,
              material,
              kwt,
              stone,
              grade,
              Gemsource,
              ringsize,
              Style,
              ringstyle,
              gemsize,
              cut,
              url,
              colour,
              shape,
              accepteddate,
              ipaddress,
              outstandingbalance,
              requiredby,
              Estimatecostfrom,
              Estimatecostto,
              lastupdate,
              status,
              submittedforquote,
              submittedfororder,
              termsaccepted,
              amontquoted,
              submitteddate,
              clarity,
              bandwidth: value,
              Prompt_Strength,
              Similarity_Strength,
              seedurl,
              Necklace_Length,
              Bracelet_Length,
              Secondary_Gemstone,
              Earring_Fastening_Types,
              Bracelet_Clasp_Types,
              Ring_Band_Style,
              Ring_Setting,
              Necklace_Chain_Style,
              Bracelet_Chain_Style,
              Brooch_Fastening_Types,
              Gem_Settings,
              Necklace_Clasp,
              clientID,
            };
            const result = onChange(modelFields);
            value = result?.bandwidth ?? value;
          }
          if (errors.bandwidth?.hasError) {
            runValidationTasks("bandwidth", value);
          }
          setBandwidth(value);
        }}
        onBlur={() => runValidationTasks("bandwidth", bandwidth)}
        errorMessage={errors.bandwidth?.errorMessage}
        hasError={errors.bandwidth?.hasError}
        {...getOverrideProps(overrides, "bandwidth")}
      ></TextField>
      <TextField
        label="Prompt strength"
        isRequired={false}
        isReadOnly={false}
        value={Prompt_Strength}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              prompt,
              costprompt,
              gender,
              jewellrytype,
              material,
              kwt,
              stone,
              grade,
              Gemsource,
              ringsize,
              Style,
              ringstyle,
              gemsize,
              cut,
              url,
              colour,
              shape,
              accepteddate,
              ipaddress,
              outstandingbalance,
              requiredby,
              Estimatecostfrom,
              Estimatecostto,
              lastupdate,
              status,
              submittedforquote,
              submittedfororder,
              termsaccepted,
              amontquoted,
              submitteddate,
              clarity,
              bandwidth,
              Prompt_Strength: value,
              Similarity_Strength,
              seedurl,
              Necklace_Length,
              Bracelet_Length,
              Secondary_Gemstone,
              Earring_Fastening_Types,
              Bracelet_Clasp_Types,
              Ring_Band_Style,
              Ring_Setting,
              Necklace_Chain_Style,
              Bracelet_Chain_Style,
              Brooch_Fastening_Types,
              Gem_Settings,
              Necklace_Clasp,
              clientID,
            };
            const result = onChange(modelFields);
            value = result?.Prompt_Strength ?? value;
          }
          if (errors.Prompt_Strength?.hasError) {
            runValidationTasks("Prompt_Strength", value);
          }
          setPrompt_Strength(value);
        }}
        onBlur={() => runValidationTasks("Prompt_Strength", Prompt_Strength)}
        errorMessage={errors.Prompt_Strength?.errorMessage}
        hasError={errors.Prompt_Strength?.hasError}
        {...getOverrideProps(overrides, "Prompt_Strength")}
      ></TextField>
      <TextField
        label="Similarity strength"
        isRequired={false}
        isReadOnly={false}
        value={Similarity_Strength}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              prompt,
              costprompt,
              gender,
              jewellrytype,
              material,
              kwt,
              stone,
              grade,
              Gemsource,
              ringsize,
              Style,
              ringstyle,
              gemsize,
              cut,
              url,
              colour,
              shape,
              accepteddate,
              ipaddress,
              outstandingbalance,
              requiredby,
              Estimatecostfrom,
              Estimatecostto,
              lastupdate,
              status,
              submittedforquote,
              submittedfororder,
              termsaccepted,
              amontquoted,
              submitteddate,
              clarity,
              bandwidth,
              Prompt_Strength,
              Similarity_Strength: value,
              seedurl,
              Necklace_Length,
              Bracelet_Length,
              Secondary_Gemstone,
              Earring_Fastening_Types,
              Bracelet_Clasp_Types,
              Ring_Band_Style,
              Ring_Setting,
              Necklace_Chain_Style,
              Bracelet_Chain_Style,
              Brooch_Fastening_Types,
              Gem_Settings,
              Necklace_Clasp,
              clientID,
            };
            const result = onChange(modelFields);
            value = result?.Similarity_Strength ?? value;
          }
          if (errors.Similarity_Strength?.hasError) {
            runValidationTasks("Similarity_Strength", value);
          }
          setSimilarity_Strength(value);
        }}
        onBlur={() =>
          runValidationTasks("Similarity_Strength", Similarity_Strength)
        }
        errorMessage={errors.Similarity_Strength?.errorMessage}
        hasError={errors.Similarity_Strength?.hasError}
        {...getOverrideProps(overrides, "Similarity_Strength")}
      ></TextField>
      <TextField
        label="Seedurl"
        isRequired={false}
        isReadOnly={false}
        value={seedurl}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              prompt,
              costprompt,
              gender,
              jewellrytype,
              material,
              kwt,
              stone,
              grade,
              Gemsource,
              ringsize,
              Style,
              ringstyle,
              gemsize,
              cut,
              url,
              colour,
              shape,
              accepteddate,
              ipaddress,
              outstandingbalance,
              requiredby,
              Estimatecostfrom,
              Estimatecostto,
              lastupdate,
              status,
              submittedforquote,
              submittedfororder,
              termsaccepted,
              amontquoted,
              submitteddate,
              clarity,
              bandwidth,
              Prompt_Strength,
              Similarity_Strength,
              seedurl: value,
              Necklace_Length,
              Bracelet_Length,
              Secondary_Gemstone,
              Earring_Fastening_Types,
              Bracelet_Clasp_Types,
              Ring_Band_Style,
              Ring_Setting,
              Necklace_Chain_Style,
              Bracelet_Chain_Style,
              Brooch_Fastening_Types,
              Gem_Settings,
              Necklace_Clasp,
              clientID,
            };
            const result = onChange(modelFields);
            value = result?.seedurl ?? value;
          }
          if (errors.seedurl?.hasError) {
            runValidationTasks("seedurl", value);
          }
          setSeedurl(value);
        }}
        onBlur={() => runValidationTasks("seedurl", seedurl)}
        errorMessage={errors.seedurl?.errorMessage}
        hasError={errors.seedurl?.hasError}
        {...getOverrideProps(overrides, "seedurl")}
      ></TextField>
      <TextField
        label="Necklace length"
        isRequired={false}
        isReadOnly={false}
        value={Necklace_Length}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              prompt,
              costprompt,
              gender,
              jewellrytype,
              material,
              kwt,
              stone,
              grade,
              Gemsource,
              ringsize,
              Style,
              ringstyle,
              gemsize,
              cut,
              url,
              colour,
              shape,
              accepteddate,
              ipaddress,
              outstandingbalance,
              requiredby,
              Estimatecostfrom,
              Estimatecostto,
              lastupdate,
              status,
              submittedforquote,
              submittedfororder,
              termsaccepted,
              amontquoted,
              submitteddate,
              clarity,
              bandwidth,
              Prompt_Strength,
              Similarity_Strength,
              seedurl,
              Necklace_Length: value,
              Bracelet_Length,
              Secondary_Gemstone,
              Earring_Fastening_Types,
              Bracelet_Clasp_Types,
              Ring_Band_Style,
              Ring_Setting,
              Necklace_Chain_Style,
              Bracelet_Chain_Style,
              Brooch_Fastening_Types,
              Gem_Settings,
              Necklace_Clasp,
              clientID,
            };
            const result = onChange(modelFields);
            value = result?.Necklace_Length ?? value;
          }
          if (errors.Necklace_Length?.hasError) {
            runValidationTasks("Necklace_Length", value);
          }
          setNecklace_Length(value);
        }}
        onBlur={() => runValidationTasks("Necklace_Length", Necklace_Length)}
        errorMessage={errors.Necklace_Length?.errorMessage}
        hasError={errors.Necklace_Length?.hasError}
        {...getOverrideProps(overrides, "Necklace_Length")}
      ></TextField>
      <TextField
        label="Bracelet length"
        isRequired={false}
        isReadOnly={false}
        value={Bracelet_Length}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              prompt,
              costprompt,
              gender,
              jewellrytype,
              material,
              kwt,
              stone,
              grade,
              Gemsource,
              ringsize,
              Style,
              ringstyle,
              gemsize,
              cut,
              url,
              colour,
              shape,
              accepteddate,
              ipaddress,
              outstandingbalance,
              requiredby,
              Estimatecostfrom,
              Estimatecostto,
              lastupdate,
              status,
              submittedforquote,
              submittedfororder,
              termsaccepted,
              amontquoted,
              submitteddate,
              clarity,
              bandwidth,
              Prompt_Strength,
              Similarity_Strength,
              seedurl,
              Necklace_Length,
              Bracelet_Length: value,
              Secondary_Gemstone,
              Earring_Fastening_Types,
              Bracelet_Clasp_Types,
              Ring_Band_Style,
              Ring_Setting,
              Necklace_Chain_Style,
              Bracelet_Chain_Style,
              Brooch_Fastening_Types,
              Gem_Settings,
              Necklace_Clasp,
              clientID,
            };
            const result = onChange(modelFields);
            value = result?.Bracelet_Length ?? value;
          }
          if (errors.Bracelet_Length?.hasError) {
            runValidationTasks("Bracelet_Length", value);
          }
          setBracelet_Length(value);
        }}
        onBlur={() => runValidationTasks("Bracelet_Length", Bracelet_Length)}
        errorMessage={errors.Bracelet_Length?.errorMessage}
        hasError={errors.Bracelet_Length?.hasError}
        {...getOverrideProps(overrides, "Bracelet_Length")}
      ></TextField>
      <TextField
        label="Secondary gemstone"
        isRequired={false}
        isReadOnly={false}
        value={Secondary_Gemstone}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              prompt,
              costprompt,
              gender,
              jewellrytype,
              material,
              kwt,
              stone,
              grade,
              Gemsource,
              ringsize,
              Style,
              ringstyle,
              gemsize,
              cut,
              url,
              colour,
              shape,
              accepteddate,
              ipaddress,
              outstandingbalance,
              requiredby,
              Estimatecostfrom,
              Estimatecostto,
              lastupdate,
              status,
              submittedforquote,
              submittedfororder,
              termsaccepted,
              amontquoted,
              submitteddate,
              clarity,
              bandwidth,
              Prompt_Strength,
              Similarity_Strength,
              seedurl,
              Necklace_Length,
              Bracelet_Length,
              Secondary_Gemstone: value,
              Earring_Fastening_Types,
              Bracelet_Clasp_Types,
              Ring_Band_Style,
              Ring_Setting,
              Necklace_Chain_Style,
              Bracelet_Chain_Style,
              Brooch_Fastening_Types,
              Gem_Settings,
              Necklace_Clasp,
              clientID,
            };
            const result = onChange(modelFields);
            value = result?.Secondary_Gemstone ?? value;
          }
          if (errors.Secondary_Gemstone?.hasError) {
            runValidationTasks("Secondary_Gemstone", value);
          }
          setSecondary_Gemstone(value);
        }}
        onBlur={() =>
          runValidationTasks("Secondary_Gemstone", Secondary_Gemstone)
        }
        errorMessage={errors.Secondary_Gemstone?.errorMessage}
        hasError={errors.Secondary_Gemstone?.hasError}
        {...getOverrideProps(overrides, "Secondary_Gemstone")}
      ></TextField>
      <TextField
        label="Earring fastening types"
        isRequired={false}
        isReadOnly={false}
        value={Earring_Fastening_Types}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              prompt,
              costprompt,
              gender,
              jewellrytype,
              material,
              kwt,
              stone,
              grade,
              Gemsource,
              ringsize,
              Style,
              ringstyle,
              gemsize,
              cut,
              url,
              colour,
              shape,
              accepteddate,
              ipaddress,
              outstandingbalance,
              requiredby,
              Estimatecostfrom,
              Estimatecostto,
              lastupdate,
              status,
              submittedforquote,
              submittedfororder,
              termsaccepted,
              amontquoted,
              submitteddate,
              clarity,
              bandwidth,
              Prompt_Strength,
              Similarity_Strength,
              seedurl,
              Necklace_Length,
              Bracelet_Length,
              Secondary_Gemstone,
              Earring_Fastening_Types: value,
              Bracelet_Clasp_Types,
              Ring_Band_Style,
              Ring_Setting,
              Necklace_Chain_Style,
              Bracelet_Chain_Style,
              Brooch_Fastening_Types,
              Gem_Settings,
              Necklace_Clasp,
              clientID,
            };
            const result = onChange(modelFields);
            value = result?.Earring_Fastening_Types ?? value;
          }
          if (errors.Earring_Fastening_Types?.hasError) {
            runValidationTasks("Earring_Fastening_Types", value);
          }
          setEarring_Fastening_Types(value);
        }}
        onBlur={() =>
          runValidationTasks("Earring_Fastening_Types", Earring_Fastening_Types)
        }
        errorMessage={errors.Earring_Fastening_Types?.errorMessage}
        hasError={errors.Earring_Fastening_Types?.hasError}
        {...getOverrideProps(overrides, "Earring_Fastening_Types")}
      ></TextField>
      <TextField
        label="Bracelet clasp types"
        isRequired={false}
        isReadOnly={false}
        value={Bracelet_Clasp_Types}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              prompt,
              costprompt,
              gender,
              jewellrytype,
              material,
              kwt,
              stone,
              grade,
              Gemsource,
              ringsize,
              Style,
              ringstyle,
              gemsize,
              cut,
              url,
              colour,
              shape,
              accepteddate,
              ipaddress,
              outstandingbalance,
              requiredby,
              Estimatecostfrom,
              Estimatecostto,
              lastupdate,
              status,
              submittedforquote,
              submittedfororder,
              termsaccepted,
              amontquoted,
              submitteddate,
              clarity,
              bandwidth,
              Prompt_Strength,
              Similarity_Strength,
              seedurl,
              Necklace_Length,
              Bracelet_Length,
              Secondary_Gemstone,
              Earring_Fastening_Types,
              Bracelet_Clasp_Types: value,
              Ring_Band_Style,
              Ring_Setting,
              Necklace_Chain_Style,
              Bracelet_Chain_Style,
              Brooch_Fastening_Types,
              Gem_Settings,
              Necklace_Clasp,
              clientID,
            };
            const result = onChange(modelFields);
            value = result?.Bracelet_Clasp_Types ?? value;
          }
          if (errors.Bracelet_Clasp_Types?.hasError) {
            runValidationTasks("Bracelet_Clasp_Types", value);
          }
          setBracelet_Clasp_Types(value);
        }}
        onBlur={() =>
          runValidationTasks("Bracelet_Clasp_Types", Bracelet_Clasp_Types)
        }
        errorMessage={errors.Bracelet_Clasp_Types?.errorMessage}
        hasError={errors.Bracelet_Clasp_Types?.hasError}
        {...getOverrideProps(overrides, "Bracelet_Clasp_Types")}
      ></TextField>
      <TextField
        label="Ring band style"
        isRequired={false}
        isReadOnly={false}
        value={Ring_Band_Style}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              prompt,
              costprompt,
              gender,
              jewellrytype,
              material,
              kwt,
              stone,
              grade,
              Gemsource,
              ringsize,
              Style,
              ringstyle,
              gemsize,
              cut,
              url,
              colour,
              shape,
              accepteddate,
              ipaddress,
              outstandingbalance,
              requiredby,
              Estimatecostfrom,
              Estimatecostto,
              lastupdate,
              status,
              submittedforquote,
              submittedfororder,
              termsaccepted,
              amontquoted,
              submitteddate,
              clarity,
              bandwidth,
              Prompt_Strength,
              Similarity_Strength,
              seedurl,
              Necklace_Length,
              Bracelet_Length,
              Secondary_Gemstone,
              Earring_Fastening_Types,
              Bracelet_Clasp_Types,
              Ring_Band_Style: value,
              Ring_Setting,
              Necklace_Chain_Style,
              Bracelet_Chain_Style,
              Brooch_Fastening_Types,
              Gem_Settings,
              Necklace_Clasp,
              clientID,
            };
            const result = onChange(modelFields);
            value = result?.Ring_Band_Style ?? value;
          }
          if (errors.Ring_Band_Style?.hasError) {
            runValidationTasks("Ring_Band_Style", value);
          }
          setRing_Band_Style(value);
        }}
        onBlur={() => runValidationTasks("Ring_Band_Style", Ring_Band_Style)}
        errorMessage={errors.Ring_Band_Style?.errorMessage}
        hasError={errors.Ring_Band_Style?.hasError}
        {...getOverrideProps(overrides, "Ring_Band_Style")}
      ></TextField>
      <TextField
        label="Ring setting"
        isRequired={false}
        isReadOnly={false}
        value={Ring_Setting}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              prompt,
              costprompt,
              gender,
              jewellrytype,
              material,
              kwt,
              stone,
              grade,
              Gemsource,
              ringsize,
              Style,
              ringstyle,
              gemsize,
              cut,
              url,
              colour,
              shape,
              accepteddate,
              ipaddress,
              outstandingbalance,
              requiredby,
              Estimatecostfrom,
              Estimatecostto,
              lastupdate,
              status,
              submittedforquote,
              submittedfororder,
              termsaccepted,
              amontquoted,
              submitteddate,
              clarity,
              bandwidth,
              Prompt_Strength,
              Similarity_Strength,
              seedurl,
              Necklace_Length,
              Bracelet_Length,
              Secondary_Gemstone,
              Earring_Fastening_Types,
              Bracelet_Clasp_Types,
              Ring_Band_Style,
              Ring_Setting: value,
              Necklace_Chain_Style,
              Bracelet_Chain_Style,
              Brooch_Fastening_Types,
              Gem_Settings,
              Necklace_Clasp,
              clientID,
            };
            const result = onChange(modelFields);
            value = result?.Ring_Setting ?? value;
          }
          if (errors.Ring_Setting?.hasError) {
            runValidationTasks("Ring_Setting", value);
          }
          setRing_Setting(value);
        }}
        onBlur={() => runValidationTasks("Ring_Setting", Ring_Setting)}
        errorMessage={errors.Ring_Setting?.errorMessage}
        hasError={errors.Ring_Setting?.hasError}
        {...getOverrideProps(overrides, "Ring_Setting")}
      ></TextField>
      <TextField
        label="Necklace chain style"
        isRequired={false}
        isReadOnly={false}
        value={Necklace_Chain_Style}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              prompt,
              costprompt,
              gender,
              jewellrytype,
              material,
              kwt,
              stone,
              grade,
              Gemsource,
              ringsize,
              Style,
              ringstyle,
              gemsize,
              cut,
              url,
              colour,
              shape,
              accepteddate,
              ipaddress,
              outstandingbalance,
              requiredby,
              Estimatecostfrom,
              Estimatecostto,
              lastupdate,
              status,
              submittedforquote,
              submittedfororder,
              termsaccepted,
              amontquoted,
              submitteddate,
              clarity,
              bandwidth,
              Prompt_Strength,
              Similarity_Strength,
              seedurl,
              Necklace_Length,
              Bracelet_Length,
              Secondary_Gemstone,
              Earring_Fastening_Types,
              Bracelet_Clasp_Types,
              Ring_Band_Style,
              Ring_Setting,
              Necklace_Chain_Style: value,
              Bracelet_Chain_Style,
              Brooch_Fastening_Types,
              Gem_Settings,
              Necklace_Clasp,
              clientID,
            };
            const result = onChange(modelFields);
            value = result?.Necklace_Chain_Style ?? value;
          }
          if (errors.Necklace_Chain_Style?.hasError) {
            runValidationTasks("Necklace_Chain_Style", value);
          }
          setNecklace_Chain_Style(value);
        }}
        onBlur={() =>
          runValidationTasks("Necklace_Chain_Style", Necklace_Chain_Style)
        }
        errorMessage={errors.Necklace_Chain_Style?.errorMessage}
        hasError={errors.Necklace_Chain_Style?.hasError}
        {...getOverrideProps(overrides, "Necklace_Chain_Style")}
      ></TextField>
      <TextField
        label="Bracelet chain style"
        isRequired={false}
        isReadOnly={false}
        value={Bracelet_Chain_Style}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              prompt,
              costprompt,
              gender,
              jewellrytype,
              material,
              kwt,
              stone,
              grade,
              Gemsource,
              ringsize,
              Style,
              ringstyle,
              gemsize,
              cut,
              url,
              colour,
              shape,
              accepteddate,
              ipaddress,
              outstandingbalance,
              requiredby,
              Estimatecostfrom,
              Estimatecostto,
              lastupdate,
              status,
              submittedforquote,
              submittedfororder,
              termsaccepted,
              amontquoted,
              submitteddate,
              clarity,
              bandwidth,
              Prompt_Strength,
              Similarity_Strength,
              seedurl,
              Necklace_Length,
              Bracelet_Length,
              Secondary_Gemstone,
              Earring_Fastening_Types,
              Bracelet_Clasp_Types,
              Ring_Band_Style,
              Ring_Setting,
              Necklace_Chain_Style,
              Bracelet_Chain_Style: value,
              Brooch_Fastening_Types,
              Gem_Settings,
              Necklace_Clasp,
              clientID,
            };
            const result = onChange(modelFields);
            value = result?.Bracelet_Chain_Style ?? value;
          }
          if (errors.Bracelet_Chain_Style?.hasError) {
            runValidationTasks("Bracelet_Chain_Style", value);
          }
          setBracelet_Chain_Style(value);
        }}
        onBlur={() =>
          runValidationTasks("Bracelet_Chain_Style", Bracelet_Chain_Style)
        }
        errorMessage={errors.Bracelet_Chain_Style?.errorMessage}
        hasError={errors.Bracelet_Chain_Style?.hasError}
        {...getOverrideProps(overrides, "Bracelet_Chain_Style")}
      ></TextField>
      <TextField
        label="Brooch fastening types"
        isRequired={false}
        isReadOnly={false}
        value={Brooch_Fastening_Types}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              prompt,
              costprompt,
              gender,
              jewellrytype,
              material,
              kwt,
              stone,
              grade,
              Gemsource,
              ringsize,
              Style,
              ringstyle,
              gemsize,
              cut,
              url,
              colour,
              shape,
              accepteddate,
              ipaddress,
              outstandingbalance,
              requiredby,
              Estimatecostfrom,
              Estimatecostto,
              lastupdate,
              status,
              submittedforquote,
              submittedfororder,
              termsaccepted,
              amontquoted,
              submitteddate,
              clarity,
              bandwidth,
              Prompt_Strength,
              Similarity_Strength,
              seedurl,
              Necklace_Length,
              Bracelet_Length,
              Secondary_Gemstone,
              Earring_Fastening_Types,
              Bracelet_Clasp_Types,
              Ring_Band_Style,
              Ring_Setting,
              Necklace_Chain_Style,
              Bracelet_Chain_Style,
              Brooch_Fastening_Types: value,
              Gem_Settings,
              Necklace_Clasp,
              clientID,
            };
            const result = onChange(modelFields);
            value = result?.Brooch_Fastening_Types ?? value;
          }
          if (errors.Brooch_Fastening_Types?.hasError) {
            runValidationTasks("Brooch_Fastening_Types", value);
          }
          setBrooch_Fastening_Types(value);
        }}
        onBlur={() =>
          runValidationTasks("Brooch_Fastening_Types", Brooch_Fastening_Types)
        }
        errorMessage={errors.Brooch_Fastening_Types?.errorMessage}
        hasError={errors.Brooch_Fastening_Types?.hasError}
        {...getOverrideProps(overrides, "Brooch_Fastening_Types")}
      ></TextField>
      <TextField
        label="Gem settings"
        isRequired={false}
        isReadOnly={false}
        value={Gem_Settings}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              prompt,
              costprompt,
              gender,
              jewellrytype,
              material,
              kwt,
              stone,
              grade,
              Gemsource,
              ringsize,
              Style,
              ringstyle,
              gemsize,
              cut,
              url,
              colour,
              shape,
              accepteddate,
              ipaddress,
              outstandingbalance,
              requiredby,
              Estimatecostfrom,
              Estimatecostto,
              lastupdate,
              status,
              submittedforquote,
              submittedfororder,
              termsaccepted,
              amontquoted,
              submitteddate,
              clarity,
              bandwidth,
              Prompt_Strength,
              Similarity_Strength,
              seedurl,
              Necklace_Length,
              Bracelet_Length,
              Secondary_Gemstone,
              Earring_Fastening_Types,
              Bracelet_Clasp_Types,
              Ring_Band_Style,
              Ring_Setting,
              Necklace_Chain_Style,
              Bracelet_Chain_Style,
              Brooch_Fastening_Types,
              Gem_Settings: value,
              Necklace_Clasp,
              clientID,
            };
            const result = onChange(modelFields);
            value = result?.Gem_Settings ?? value;
          }
          if (errors.Gem_Settings?.hasError) {
            runValidationTasks("Gem_Settings", value);
          }
          setGem_Settings(value);
        }}
        onBlur={() => runValidationTasks("Gem_Settings", Gem_Settings)}
        errorMessage={errors.Gem_Settings?.errorMessage}
        hasError={errors.Gem_Settings?.hasError}
        {...getOverrideProps(overrides, "Gem_Settings")}
      ></TextField>
      <TextField
        label="Necklace clasp"
        isRequired={false}
        isReadOnly={false}
        value={Necklace_Clasp}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              prompt,
              costprompt,
              gender,
              jewellrytype,
              material,
              kwt,
              stone,
              grade,
              Gemsource,
              ringsize,
              Style,
              ringstyle,
              gemsize,
              cut,
              url,
              colour,
              shape,
              accepteddate,
              ipaddress,
              outstandingbalance,
              requiredby,
              Estimatecostfrom,
              Estimatecostto,
              lastupdate,
              status,
              submittedforquote,
              submittedfororder,
              termsaccepted,
              amontquoted,
              submitteddate,
              clarity,
              bandwidth,
              Prompt_Strength,
              Similarity_Strength,
              seedurl,
              Necklace_Length,
              Bracelet_Length,
              Secondary_Gemstone,
              Earring_Fastening_Types,
              Bracelet_Clasp_Types,
              Ring_Band_Style,
              Ring_Setting,
              Necklace_Chain_Style,
              Bracelet_Chain_Style,
              Brooch_Fastening_Types,
              Gem_Settings,
              Necklace_Clasp: value,
              clientID,
            };
            const result = onChange(modelFields);
            value = result?.Necklace_Clasp ?? value;
          }
          if (errors.Necklace_Clasp?.hasError) {
            runValidationTasks("Necklace_Clasp", value);
          }
          setNecklace_Clasp(value);
        }}
        onBlur={() => runValidationTasks("Necklace_Clasp", Necklace_Clasp)}
        errorMessage={errors.Necklace_Clasp?.errorMessage}
        hasError={errors.Necklace_Clasp?.hasError}
        {...getOverrideProps(overrides, "Necklace_Clasp")}
      ></TextField>
      <ArrayField
        lengthLimit={1}
        onChange={async (items) => {
          let value = items[0];
          if (onChange) {
            const modelFields = {
              prompt,
              costprompt,
              gender,
              jewellrytype,
              material,
              kwt,
              stone,
              grade,
              Gemsource,
              ringsize,
              Style,
              ringstyle,
              gemsize,
              cut,
              url,
              colour,
              shape,
              accepteddate,
              ipaddress,
              outstandingbalance,
              requiredby,
              Estimatecostfrom,
              Estimatecostto,
              lastupdate,
              status,
              submittedforquote,
              submittedfororder,
              termsaccepted,
              amontquoted,
              submitteddate,
              clarity,
              bandwidth,
              Prompt_Strength,
              Similarity_Strength,
              seedurl,
              Necklace_Length,
              Bracelet_Length,
              Secondary_Gemstone,
              Earring_Fastening_Types,
              Bracelet_Clasp_Types,
              Ring_Band_Style,
              Ring_Setting,
              Necklace_Chain_Style,
              Bracelet_Chain_Style,
              Brooch_Fastening_Types,
              Gem_Settings,
              Necklace_Clasp,
              clientID: value,
            };
            const result = onChange(modelFields);
            value = result?.clientID ?? value;
          }
          setClientID(value);
          setCurrentClientIDValue(undefined);
        }}
        currentFieldValue={currentClientIDValue}
        label={"Client id"}
        items={clientID ? [clientID] : []}
        hasError={errors?.clientID?.hasError}
        runValidationTasks={async () =>
          await runValidationTasks("clientID", currentClientIDValue)
        }
        errorMessage={errors?.clientID?.errorMessage}
        getBadgeText={(value) =>
          value
            ? getDisplayValue.clientID(
                clientIDRecords.find((r) => r.id === value) ??
                  selectedClientIDRecords.find((r) => r.id === value)
              )
            : ""
        }
        setFieldValue={(value) => {
          setCurrentClientIDDisplayValue(
            value
              ? getDisplayValue.clientID(
                  clientIDRecords.find((r) => r.id === value) ??
                    selectedClientIDRecords.find((r) => r.id === value)
                )
              : ""
          );
          setCurrentClientIDValue(value);
          const selectedRecord = clientIDRecords.find((r) => r.id === value);
          if (selectedRecord) {
            setSelectedClientIDRecords([selectedRecord]);
          }
        }}
        inputFieldRef={clientIDRef}
        defaultFieldValue={""}
      >
        <Autocomplete
          label="Client id"
          isRequired={true}
          isReadOnly={false}
          placeholder="Search Client"
          value={currentClientIDDisplayValue}
          options={clientIDRecords
            .filter(
              (r, i, arr) =>
                arr.findIndex((member) => member?.id === r?.id) === i
            )
            .map((r) => ({
              id: r?.id,
              label: getDisplayValue.clientID?.(r),
            }))}
          isLoading={clientIDLoading}
          onSelect={({ id, label }) => {
            setCurrentClientIDValue(id);
            setCurrentClientIDDisplayValue(label);
            runValidationTasks("clientID", label);
          }}
          onClear={() => {
            setCurrentClientIDDisplayValue("");
          }}
          defaultValue={clientID}
          onChange={(e) => {
            let { value } = e.target;
            fetchClientIDRecords(value);
            if (errors.clientID?.hasError) {
              runValidationTasks("clientID", value);
            }
            setCurrentClientIDDisplayValue(value);
            setCurrentClientIDValue(undefined);
          }}
          onBlur={() => runValidationTasks("clientID", currentClientIDValue)}
          errorMessage={errors.clientID?.errorMessage}
          hasError={errors.clientID?.hasError}
          ref={clientIDRef}
          labelHidden={true}
          {...getOverrideProps(overrides, "clientID")}
        ></Autocomplete>
      </ArrayField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Reset"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          isDisabled={!(idProp || creationsModelProp)}
          {...getOverrideProps(overrides, "ResetButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={
              !(idProp || creationsModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
