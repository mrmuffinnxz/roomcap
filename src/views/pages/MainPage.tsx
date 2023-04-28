import { useGenerator } from "@/contexts/GeneratorContext";
import {
  Box,
  Button,
  Container,
  Grid,
  GridItem,
  Image,
  Select,
  Text,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import Head from "next/head";
import { UploadDropzone } from "react-uploader";
import { Uploader } from "uploader";
import { GrPowerReset } from "react-icons/gr";

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
    caption,
    setCaption,
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
          console.log(res.data);
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
              <Text fontSize={"32px"} fontWeight={600}>
                Roomcap 🧢
              </Text>
              <Text>
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
                      Step 3: Click generate to get your result
                    </Text>
                    <Button
                      colorScheme={"spaceblue"}
                      onClick={() => {
                        setIsLoading(true);
                        generate()
                          .then(() => {
                            setIsLoading(false);
                          })
                          .catch(() => {
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
                          setCaption(null);
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
                    <Text fontSize={"20px"} fontWeight={600}>
                      Room Analysis
                    </Text>
                    <Text fontSize={"20px"} fontWeight={600}>
                      Suggestion
                    </Text>
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
