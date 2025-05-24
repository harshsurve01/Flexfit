// app/screens/camera.tsx
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useGlobalContext } from '@/lib/global_provider';
import { Client, Databases, ID } from 'react-native-appwrite';
import { useNavigation } from '@react-navigation/native';

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('6782bc1d000ee590075f');
const databases = new Databases(client);

export default function CameraScreen() {
  const navigation = useNavigation();
  const { user } = useGlobalContext();
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [pushupCount, setPushupCount] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  const DATABASE_ID = '67a0fae6002c2c5a3b13';
  const COLLECTION_ID = 'user_stats';

  // Keep track of latest count to use in cleanup
  const pushupCountRef = useRef(pushupCount);
  useEffect(() => {
    pushupCountRef.current = pushupCount;
  }, [pushupCount]);

  const getCurrentUTCDate = () => {
    const now = new Date();
    return new Date(Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate()
    )).toISOString();
  };

  const saveAndExit = useCallback(async (count: number) => {
    if (!user?.$id) return;

    try {
      setIsSaving(true);
      await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        {
          user_id: user.$id,
          pushup_count: count,
          flexpoints: Math.floor(count / 10),
          lastUpdated: getCurrentUTCDate()
        }
      );
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setIsSaving(false);
      // @ts-ignore - Navigate to tabs root
      navigation.navigate('(tabs)');
    }
  }, [user?.$id, navigation]);

  // Save on unmount only
  useEffect(() => {
    return () => {
      const finalCount = pushupCountRef.current;
      if (finalCount > 0) {
        saveAndExit(finalCount);
      }
    };
  }, [saveAndExit]);

  const handlePushup = () => {
    setPushupCount(prev => prev + 1);
  };

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Camera permission required</Text>
        <Button onPress={requestPermission} title="Grant Access" />
      </View>
    );
  }

  const currentDate = new Date(getCurrentUTCDate());
  const formattedDate = currentDate.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'UTC'
  });

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>Pushups: {pushupCount}</Text>
          <Text style={styles.statsText}>FlexPoints: {Math.floor(pushupCount / 10)}</Text>
          <Text style={styles.dateText}>Date: {formattedDate}</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setFacing(current => current === 'back' ? 'front' : 'back')}
          >
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.detectionButton}
          onPress={handlePushup}
          disabled={isSaving}
        >
          <Text style={styles.buttonText}>
            {isSaving ? 'Saving...' : 'Add Pushup'}
          </Text>
        </TouchableOpacity>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  statsContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 15,
    borderRadius: 10,
  },
  statsText: {
    fontSize: 20,
    color: 'white',
    marginVertical: 4,
  },
  dateText: {
    fontSize: 16,
    color: 'white',
    marginTop: 4
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  detectionButton: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});
