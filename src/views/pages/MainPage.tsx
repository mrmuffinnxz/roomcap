import { useGenerator } from "@/contexts/GeneratorContext";
import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  GridItem,
  Image,
  Select,
  Spinner,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import Head from "next/head";
import { UploadDropzone } from "react-uploader";
import { Uploader } from "uploader";
import { CopyToClipboard } from "react-copy-to-clipboard";

const uploader = Uploader({
  apiKey: !!process.env.NEXT_PUBLIC_UPLOAD_API_KEY
    ? process.env.NEXT_PUBLIC_UPLOAD_API_KEY
    : "free",
});

const options = {
  maxFileCount: 1,
  mimeTypes: ["image/jpeg", "image/png", "image/jpg"],
  editor: { images: { crop: false } },
  styles: {
    colors: { primary: "#2563EB" },
  },
};

export function MainPage() {
  const {
    originalImage,
    setOriginalImage,
    theory,
    setTheory,
    isLoading,
    setIsLoading,
    analysis,
    setAnalysis,
    suggestion,
    setSuggestion,
    error,
    setError,
  } = useGenerator();

  const UploadZone = () => (
    <UploadDropzone
      uploader={uploader}
      options={options}
      onUpdate={(file) => {
        if (file.length !== 0) {
          const imageUrl = file[0].fileUrl.replace("raw", "thumbnail");
          setOriginalImage(imageUrl);
        }
      }}
      width="400px"
      height="250px"
    />
  );

  const generate = async () => {
    if (!originalImage) {
      return;
    }
    await axios
      .post("/api/generate", {
        imageUrl: originalImage,
        theory,
      })
      .then((res) => {
        if (res.status === 200) {
          setAnalysis(res.data.analysis);
          setSuggestion(res.data.suggestion);
        }
      });
  };

  return (
    <>
      <Head>
        <title>Roomcap</title>
      </Head>
      <Box
        minHeight={"100vh"}
        height="auto"
        backgroundImage={"#EFEFEF"}
        backgroundRepeat="no-repeat"
        backgroundSize="cover"
        backgroundPosition="center"
        backgroundAttachment="fixed"
      >
        <Box pt="3vh" pb="5vh">
          <Container maxW="container.xl">
            <VStack w="100%">
              <Text fontSize={"32px"} fontWeight={600} textAlign={"center"}>
                Roomcap 🧢
              </Text>
              <Text textAlign={"center"}>
                Evaluate your room design with multiple theory and give a
                suggestion to improve using AI
              </Text>
              <Grid pt={4} templateColumns="repeat(10, 1fr)" gap={4} w="100%">
                <GridItem colSpan={{ base: 10, md: 4 }}>
                  <VStack
                    p={8}
                    w="100%"
                    h="100%"
                    borderRadius={8}
                    border="1px solid #EFEFEF"
                    boxShadow={"md"}
                    textAlign={"center"}
                  >
                    <Text fontWeight={600}>Step 1: Upload your room image</Text>
                    {originalImage ? (
                      <Image
                        src={originalImage}
                        alt="Original Image"
                        w="400px"
                        h="250px"
                        fit={"contain"}
                      />
                    ) : (
                      <UploadZone />
                    )}
                    <Text fontWeight={600}>Step 2: Select your theory</Text>
                    <Select
                      value={theory}
                      onChange={(e) => {
                        setTheory(e.target.value);
                      }}
                      w="auto"
                    >
                      <option value={"7-elements"}>
                        7 elements of interior design
                      </option>
                      <option value={"feng-shui"}>Feng Shui</option>
                    </Select>
                    <Text fontWeight={600}>
                      Step 3: Click to get result
                    </Text>
                    <Button
                      colorScheme={"spaceblue"}
                      onClick={() => {
                        setError(null);
                        setIsLoading(true);
                        generate()
                          .then(() => {
                            setIsLoading(false);
                          })
                          .catch((e) => {
                            setError(
                              "Something went wrong, Please try again in 10 minutes"
                            );
                            setIsLoading(false);
                          });
                      }}
                      isDisabled={isLoading || !originalImage}
                    >
                      Generate
                    </Button>
                    <Text
                      fontWeight={600}
                      color={isLoading || !originalImage ? "gray" : "primary.0"}
                      onClick={() => {
                        if (!isLoading) {
                          setOriginalImage(null);
                          setAnalysis(null);
                          setSuggestion(null);
                        }
                      }}
                      cursor={
                        isLoading || !originalImage ? "not-allowed" : "pointer"
                      }
                    >
                      Reset
                    </Text>
                  </VStack>
                </GridItem>
                <GridItem colSpan={{ base: 10, md: 6 }}>
                  <VStack
                    p={8}
                    w="100%"
                    h="100%"
                    borderRadius={8}
                    border="1px solid #EFEFEF"
                    boxShadow={"md"}
                    align={"left"}
                  >
                    {isLoading && (
                      <Flex
                        w="100%"
                        h="100%"
                        justifyContent={"center"}
                        alignItems={"center"}
                        flexDirection={"column"}
                        gap={2}
                      >
                        <Spinner color={"primary.0"} size={"xl"} />
                        <Text>Your result is on the way!</Text>
                      </Flex>
                    )}
                    {!isLoading && (!analysis || !suggestion) && (
                      <Flex
                        w="100%"
                        h="100%"
                        justifyContent={"center"}
                        alignItems={"center"}
                        flexDirection={"column"}
                        gap={2}
                      >
                        <Text>
                          upload your room, select your prefer theory and start
                          generating your result
                        </Text>
                      </Flex>
                    )}
                    {!isLoading && analysis && suggestion && (
                      <Grid templateColumns="repeat(1, 1fr)" h="100%" gap={4}>
                        <GridItem>
                          <VStack w="100%" h="100%">
                            <Flex
                              w="100%"
                              alignItems={"center"}
                              justifyContent={"space-between"}
                            >
                              <Text fontSize={"20px"} fontWeight={600}>
                                Room Analysis
                              </Text>
                              <CopyToClipboard text={analysis}>
                                <Button>Copy</Button>
                              </CopyToClipboard>
                            </Flex>
                            <Textarea
                              value={analysis}
                              isReadOnly
                              w="100%"
                              h={{md: "100%", base: "300px"}}
                            />
                          </VStack>
                        </GridItem>
                        <GridItem>
                          <VStack w="100%" h="100%">
                            <Flex
                              w="100%"
                              alignItems={"center"}
                              justifyContent={"space-between"}
                            >
                              <Text fontSize={"20px"} fontWeight={600}>
                                Suggestion
                              </Text>
                              <CopyToClipboard text={suggestion}>
                                <Button>Copy</Button>
                              </CopyToClipboard>
                            </Flex>
                            <Textarea
                              value={suggestion}
                              isReadOnly
                              w="100%"
                              h={{md: "100%", base: "300px"}}
                            />
                          </VStack>
                        </GridItem>
                      </Grid>
                    )}
                  </VStack>
                </GridItem>
              </Grid>
            </VStack>
          </Container>
        </Box>
      </Box>
    </>
  );
}
