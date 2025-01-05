import ViewOwn from '@/components/own/View';
import { Link, useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Card,
  Divider,
  IconButton,
  Paragraph,
  Subheading,
  Title,
  useTheme,
} from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const PrivacyPolicy = () => {
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const navigation = useNavigation();

  const primaryColor = theme.colors.primary;

  useEffect(() => {
    navigation.setOptions({
      headerBackButtonMenuEnabled: true,
      headerBackVisible: true,
    });
  }, [navigation]);

  return (
    <ViewOwn scroll style={[styles.container]}>
      <Card style={[styles.card, { marginBottom: insets.top }]}>
        <Card.Content>
          <View style={styles.titleContainer}>
            <Title style={styles.title}>Règles de Confidentialité</Title>
          </View>
          <Paragraph style={styles.intro}>
            Bienvenue dans notre application de lecteur audio M4B. Nous prenons la confidentialité
            de nos utilisateurs très au sérieux. Cette page détaille comment nous gérons vos données
            et les permissions nécessaires pour utiliser l'application.
          </Paragraph>

          <Divider style={styles.divider} />

          <View style={styles.section}>
            <IconButton icon="database" size={24} iconColor={primaryColor} />
            <Subheading style={styles.subheading}>1. Données collectées</Subheading>
          </View>
          <Paragraph style={styles.paragraph}>
            Cette application ne collecte aucune donnée personnelle ou sensible. Nous ne stockons
            aucune information utilisateur.
          </Paragraph>

          <Divider style={styles.divider} />

          <View style={styles.section}>
            <IconButton icon="music" size={24} iconColor={primaryColor} />
            <Subheading style={styles.subheading}>2. Fichiers audio</Subheading>
          </View>
          <Paragraph style={styles.paragraph}>
            Les fichiers audio sont hébergés sur un serveur externe et ne sont pas téléchargés ni
            stockés sur votre appareil. L'application agit uniquement comme un lecteur permettant
            d'accéder à ces fichiers.
          </Paragraph>

          <Divider style={styles.divider} />

          <View style={styles.section}>
            <IconButton icon="lock" size={24} iconColor={primaryColor} />
            <Subheading style={styles.subheading}>3. Permissions requises</Subheading>
          </View>
          <Paragraph style={styles.paragraph}>
            - **Accès au stockage local** : Cette permission est utilisée uniquement pour
            sauvegarder les paramètres de configuration de l'application, comme vos préférences
            utilisateur. Aucune autre donnée n'est enregistrée ou utilisée.
          </Paragraph>

          <Divider style={styles.divider} />

          <View style={styles.section}>
            <IconButton icon="folder" size={24} iconColor={primaryColor} />
            <Subheading style={styles.subheading}>4. Stockage local</Subheading>
          </View>
          <Paragraph style={styles.paragraph}>
            L'application ne stocke que des données de configuration telles que vos préférences (par
            exemple, le thème sombre ou la langue). Aucun fichier multimédia ou autre contenu n'est
            sauvegardé localement.
          </Paragraph>

          <Divider style={styles.divider} />

          <View style={styles.section}>
            <IconButton icon="shield-check" size={24} iconColor={primaryColor} />
            <Subheading style={styles.subheading}>5. Sécurité</Subheading>
          </View>
          <Paragraph style={styles.paragraph}>
            Nous mettons en œuvre les meilleures pratiques pour protéger vos informations. Les
            fichiers audio sont stockés de manière sécurisée sur un serveur externe.
          </Paragraph>

          <Divider style={styles.divider} />

          <View style={styles.section}>
            <IconButton icon="update" size={24} iconColor={primaryColor} />
            <Subheading style={styles.subheading}>6. Modifications</Subheading>
          </View>
          <Paragraph style={styles.paragraph}>
            Nous pouvons mettre à jour ces règles de confidentialité pour refléter les évolutions de
            l'application ou les exigences réglementaires. Nous vous recommandons de consulter cette
            page régulièrement.
          </Paragraph>

          <Divider style={styles.divider} />

          <View style={styles.section}>
            <IconButton icon="email" size={24} iconColor={primaryColor} />
            <Subheading style={styles.subheading}>7. Contact</Subheading>
          </View>
          <Paragraph style={styles.paragraph}>
            Si vous avez des questions ou des préoccupations concernant cette politique de
            confidentialité, veuillez nous contacter à l'adresse suivante :
          </Paragraph>
          <Paragraph style={[styles.paragraph, styles.bold]}>
            <Link href="mailto:contact@vendorbox.fr">contact@vendorbox.fr</Link>
          </Paragraph>

          <Divider style={styles.divider} />

          <View style={styles.section}>
            <IconButton icon="web" size={24} iconColor={primaryColor} />
            <Subheading style={styles.subheading}>8. Lien vers cette politique</Subheading>
          </View>
          <Paragraph style={styles.paragraph}>
            Vous pouvez également consulter cette politique sur notre site web à l'adresse suivante
            :
          </Paragraph>
          <Paragraph style={[styles.paragraph, styles.bold]}>
            <Link href="https://sharing.vendorbox.fr/privacy-policy">
              https://sharing.vendorbox.fr/privacy-policy
            </Link>
          </Paragraph>
        </Card.Content>
      </Card>
    </ViewOwn>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  card: {
    flex: 1,
    padding: 8,
    borderRadius: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  intro: {
    fontSize: 16,
    marginBottom: 16,
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  subheading: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
  },
  bold: {
    fontWeight: 'bold',
  },
  divider: {
    marginVertical: 16,
  },
});

export default PrivacyPolicy;
