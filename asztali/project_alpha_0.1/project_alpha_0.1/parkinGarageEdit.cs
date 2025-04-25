using project_alpha_0._1.osztalyok;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace project_alpha_0._1
{
    public partial class parkinGarageEdit : Form
    {
        HttpRequestek request = new HttpRequestek();
        public parkinGarageEdit()
        {
            InitializeComponent();
            getParkingHouses();
            Start();


            button1.Click += backBtn;
            button2.Click += editBtn;
        }
        public void Start()
        {
            this.FormBorderStyle = FormBorderStyle.None;

            this.BackColor = Color.FromArgb(93, 135, 54);
            label1.BackColor = Color.FromArgb(93, 135, 54);

            label1.Text = "Parkolóház választó";
            label1.Font = new Font("Arial", 20, FontStyle.Bold);

            button1.Text = "Vissza";
            button2.Text = "Hozzáadás";

            int label1Mid = label1.Width / 2;

            label1.Left = this.Width / 2 - label1Mid;
            button1.Left = this.Width / 2 - button1.Width - 40;
            button2.Left = this.Width / 2 + 40;

            //button2.Left = button1.Width + ;
        }

        public void backBtn(object s, EventArgs e)
        {
            const string message = "Biztosan vissza akarsz lépni?";
            const string caption = "Visszalépés";
            var result = MessageBox.Show(message, caption,
                                         MessageBoxButtons.YesNo,
                                         MessageBoxIcon.Question);
            if (result == DialogResult.Yes)
            {
                this.Close();
                Menu menuForm = new Menu();
                menuForm.Show();
                //this.Close();
            }
        }

        public void editBtn(object s, EventArgs e)
        {
            const string message = "Fejlesztés alatt";
            const string caption = "Hiba";
            var result = MessageBox.Show(message, caption,
                                         MessageBoxButtons.OK,
                                         MessageBoxIcon.Error);
        }

        public void errorBtn(object s, EventArgs e)
        {
            const string message = "Fejlesztés alatt";
            const string caption = "Hiba";
            var result = MessageBox.Show(message, caption,
                                         MessageBoxButtons.OK,
                                         MessageBoxIcon.Error);
        }

        private async void getParkingHouses()
        {
            int topMargin = label1.Bottom + 10;
            int bottomBoundary = Math.Min(button1.Top, button2.Top) - 10;
            int dynamicAreaHeight = bottomBoundary - topMargin;

            Point panelLocation = new Point(100, 100);
            Size panelSize = new Size(600, 350);

            FlowLayoutPanel dynamicButtonPanel = new FlowLayoutPanel
            {
                Location = panelLocation,
                Size = panelSize,
                BackColor = Color.FromArgb(169, 196, 108),
                AutoScroll = true,
                FlowDirection = FlowDirection.LeftToRight,
                WrapContents = true,
                Padding = new Padding(10)
            };

            this.Controls.Add(dynamicButtonPanel);
            dynamicButtonPanel.BringToFront();

            List<Parkhouses> garages = await request.getParkhouses();

            foreach (var garage in garages)
            {
                Button btn = new Button
                {
                    Text = garage.name,
                    Width = 125,
                    Height = 50,
                    Margin = new Padding(10),
                    BackColor = Color.FromArgb(244, 255, 195)
                };

                btn.Click += ParkingGarageButton_Click;

                dynamicButtonPanel.Controls.Add(btn);

                button1.BringToFront();
                button2.BringToFront();

            }
        }

        private void ParkingGarageButton_Click(object sender, EventArgs e)
        {
            if (sender is Button btn && btn.Tag is Parkhouses garage)
            {
                MessageBox.Show($"Kiválasztott parkolóház: {garage.name}", "Információ", MessageBoxButtons.OK, MessageBoxIcon.Information);
                // Itt nyithatsz meg egy részletes formot, vagy végrehajthatsz más műveleteket.
            }
        }
    }
}
