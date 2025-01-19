export type Theme = {
  name: string;
  screens: [
    {
      name: string;
      cellBackgroundColor: string;
      cellTextColor: string;
      headerTextColor: string;
      menuType: string;
      rowBackgroundColor: string;
      backgroundImage: string;
      backgroundColor: string;
    }
  ];
};

export type Preferences = {
  theme: Theme;
};