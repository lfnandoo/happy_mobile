import React from "react";

import { StyleSheet, Text, View, Dimensions } from "react-native";
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from "react-native-maps";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { RectButton } from "react-native-gesture-handler";

import { Feather } from "@expo/vector-icons";

import mapMarker from "../images/map_marker.png";

import api from "../services/api";

interface OrphanageProps {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

export default function OrphanagesMap() {
  const [orphanages, setOrphanages] = React.useState<OrphanageProps[]>([]);
  const navigation = useNavigation();

  useFocusEffect(() => {
    (async () => {
      const { data } = await api.get("orphanages");
      setOrphanages(data);
    })();
  });

  function handleNavigateToOrphanageDetails(id: number) {
    navigation.navigate("OrphanageDetails", { id });
  }

  function handleNavigateToCreateOrphanage() {
    navigation.navigate("SelectMapPosition");
  }

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: -22.7234615,
          longitude: -43.3695283,
          latitudeDelta: 0.008,
          longitudeDelta: 0.008
        }}
      >
        {orphanages.map((orphanage) => {
          return (
            <Marker
              key={orphanage.id}
              icon={mapMarker}
              calloutAnchor={{
                x: 2.7,
                y: 0.8
              }}
              coordinate={{
                latitude: orphanage.latitude,
                longitude: orphanage.longitude
              }}
            >
              <Callout
                tooltip={true}
                onPress={() => handleNavigateToOrphanageDetails(orphanage.id)}
              >
                <View style={styles.calloutContainer}>
                  <Text style={styles.calloutText}>{orphanage.name}</Text>
                </View>
              </Callout>
            </Marker>
          );
        })}
      </MapView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {orphanages.length} orfanatos encontrados
        </Text>

        <RectButton
          style={styles.createOrphanageButton}
          onPress={handleNavigateToCreateOrphanage}
        >
          <Feather name="plus" size={20} color="#FFF" />
        </RectButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height
  },

  calloutContainer: {
    width: 160,
    height: 46,
    paddingHorizontal: 16,
    backgroundColor: "rgba(255, 255, 255, .8)",
    justifyContent: "center",
    borderRadius: 10,
    fontFamily: "Nunito_700Bold"
  },

  calloutText: {
    color: "#0089a5",
    fontSize: 14
  },

  footer: {
    position: "absolute",
    left: 24,
    right: 24,
    bottom: 32,

    backgroundColor: "#FFF",
    borderRadius: 20,
    height: 56,
    paddingLeft: 24,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    elevation: 5
  },

  footerText: {
    fontFamily: "Nunito_700Bold",
    color: "#8fa7b3"
  },

  createOrphanageButton: {
    width: 56,
    height: 56,
    backgroundColor: "#15c3d6",
    borderRadius: 20,

    justifyContent: "center",
    alignItems: "center"
  }
});
