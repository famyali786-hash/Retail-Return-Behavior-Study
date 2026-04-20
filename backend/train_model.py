DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "data.json")
MODEL_PATH = os.path.join(os.path.dirname(__file__), "model.pkl")

print("Loading data...")
with open(DATA_PATH, "r", encoding="utf-8") as f:
    raw = json.load(f)

df = pd.DataFrame(raw)
print(f"Loaded {len(df):,} records. Columns: {list(df.columns)}")

le = LabelEncoder()
df["Country_enc"] = le.fit_transform(df["Country"])

feature_cols = ["Quantity", "UnitPrice", "Country_enc", "Month"]
target_col = "Return"

X = df[feature_cols].values
y = df[target_col].values

print(f"Class distribution — Return=1: {y.sum():,}  Return=0: {(y==0).sum():,}")

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

print("Training Random Forest...")
clf = RandomForestClassifier(
    n_estimators=100,
    max_depth=12,
    class_weight="balanced",
    random_state=42,
    n_jobs=-1,
)
clf.fit(X_train, y_train)

y_pred = clf.predict(X_test)
y_prob = clf.predict_proba(X_test)[:, 1]

print("\n-- Classification Report --")
print(classification_report(y_test, y_pred, target_names=["No Return", "Return"]))
print("ROC-AUC: {:.4f}".format(roc_auc_score(y_test, y_prob)))

artifact = {
    "model": clf,
    "label_encoder": le,
    "feature_cols": feature_cols,
    "countries": list(le.classes_),
}
joblib.dump(artifact, MODEL_PATH)
print("\nModel saved to: {}".format(MODEL_PATH))